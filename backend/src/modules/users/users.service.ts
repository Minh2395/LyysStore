import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User, AccountType, UserRole } from './schemas/user.schema';
import { isValidEntityId } from '../../database/entity-id';
import aqp from 'api-query-params';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

import { hashPasswordHelper } from '../../helpers/util';

import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from '../../auth/dto/create-auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  // ======================
  // EMAIL CHECK
  // ======================
  async isEmailExist(email: string) {
    return !!(await this.userRepository.findOneBy({
      email: email.toLowerCase().trim(),
      is_deleted: false,
    }));
  }

  // ======================
  // CREATE USER
  // ======================
  async create(dto: CreateAuthDto) {
    const { name, email, password, phone } = dto;

    if (await this.isEmailExist(email)) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashPassword = await hashPasswordHelper(password);

    const user = this.userRepository.create({
      name: name?.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword,
      phone,

      role: UserRole.USER,
      account_type: AccountType.LOCAL,
      is_active: true,
    });
    await this.userRepository.save(user);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  }

  // ======================
  // FIND ALL
  // ======================
  async findAll(
    query: Record<string, string | string[]> | string,
    current = 1,
    pageSize = 10,
  ) {
    const parsedQuery = aqp(query);
    const filter = this.toFilterRecord(parsedQuery.filter);
    const { sort } = parsedQuery;

    delete filter.current;
    delete filter.pageSize;

    filter.is_deleted = false;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.is_deleted = :is_deleted', { is_deleted: false });
    this.applyFilters(queryBuilder, filter);

    const sortableFields = new Set([
      '_id',
      'name',
      'email',
      'phone',
      'account_type',
      'role',
      'is_active',
      'is_deleted',
      'createdAt',
      'updatedAt',
    ]);
    if (sort && typeof sort === 'object') {
      for (const [field, direction] of Object.entries(sort)) {
        if (!sortableFields.has(field)) {
          continue;
        }
        const order = direction === -1 ? 'DESC' : 'ASC';
        queryBuilder.addOrderBy(`user.${field}`, order);
      }
    }

    const [users, totalItems] = await queryBuilder
      .skip((current - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    const results = users.map((user) => {
      const { password, ...publicUser } = user;
      void password;
      return publicUser;
    });

    return {
      meta: {
        current,
        pageSize,
        pages: Math.ceil(totalItems / pageSize),
        total: totalItems,
      },
      results,
    };
  }

  // ======================
  // FIND BY EMAIL
  // ======================
  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email.toLowerCase().trim() });
  }

  // ======================
  // FIND BY ID
  // ======================
  async findById(id: string) {
    if (!isValidEntityId(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const user = await this.userRepository.findOneBy({
      _id: id,
      is_deleted: false,
    });

    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }

    const { password, ...publicUser } = user;
    void password;
    return publicUser;
  }

  // ======================
  // UPDATE USER
  // ======================
  async update(dto: UpdateUserDto & { _id: string }) {
    const { _id, name, email, phone } = dto;

    if (!isValidEntityId(_id)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const user = await this.userRepository.findOneBy({
      _id,
      is_deleted: false,
    });

    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }

    const normalizedEmail = email?.toLowerCase().trim();
    if (normalizedEmail && normalizedEmail !== user.email) {
      const existed = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: normalizedEmail })
        .andWhere('user._id <> :id', { id: _id })
        .andWhere('user.is_deleted = :is_deleted', { is_deleted: false })
        .getOne();

      if (existed) {
        throw new BadRequestException('Email đã tồn tại');
      }
    }

    await this.userRepository.update(
      { _id },
      {
        ...(name && { name: name.trim() }),
        ...(normalizedEmail && { email: normalizedEmail }),
        ...(phone && { phone }),
      },
    );

    return { message: 'Update thành công' };
  }

  // ======================
  // HARD DELETE
  // ======================
  async remove(_id: string) {
    if (!isValidEntityId(_id)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const result = await this.userRepository.delete({ _id });

    console.log(typeof _id, _id);
    console.log('DELETE RESULT:', result);

    if (result.affected === 0) {
      throw new BadRequestException('User không tồn tại hoặc đã bị xóa');
    }

    return {
      message: 'Xóa user thành công',
      _id,
    };
  }

  // ======================
  // REGISTER
  // ======================
  async handleRegister(dto: CreateAuthDto) {
    const { name, email, password } = dto;

    if (await this.isEmailExist(email)) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashPassword = await hashPasswordHelper(password);
    const code = uuidv4();

    const user = this.userRepository.create({
      name: name?.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword,

      role: UserRole.USER,
      account_type: AccountType.LOCAL,

      is_active: false,
      verification_code: code,
      verification_expires: new Date(Date.now() + 10 * 60 * 1000),
    });
    await this.userRepository.save(user);

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Activate your account',
        template: 'register',
        context: {
          name: user.name,
          activationCode: code,
        },
      });

      console.log('Mail sent');
    } catch (err) {
      console.error(err);
    }

    return { _id: user._id };
  }

  // ======================
  // ACTIVE ACCOUNT
  // ======================
  async handleActive(data: CodeAuthDto) {
    const user = await this.userRepository.findOneBy({
      _id: data._id,
      verification_code: data.code,
      is_deleted: false,
    });

    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }

    // check expire
    const isBeforeCheck =
      !!user.verification_expires &&
      new Date().getTime() < new Date(user.verification_expires).getTime();

    if (!isBeforeCheck) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }

    // activate account
    await this.userRepository.update(
      { _id: user._id },
      {
        is_active: true,
        verification_code: null,
        verification_expires: null,
      },
    );

    return {
      message: 'Kích hoạt tài khoản thành công',
    };
  }

  // ======================
  // RETRY ACTIVE
  // ======================
  async retryActive(email: string) {
    const user = await this.userRepository.findOneBy({
      email: email.toLowerCase().trim(),
      is_deleted: false,
    });

    if (!user) throw new BadRequestException('Email không tồn tại');
    if (user.is_active) throw new BadRequestException('Đã kích hoạt');

    const code = uuidv4();

    await this.userRepository.update(
      { _id: user._id },
      {
        verification_code: code,
        verification_expires: new Date(Date.now() + 10 * 60 * 1000),
      },
    );

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate account',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: code,
      },
    });

    return { _id: user._id };
  }

  // ======================
  // RETRY PASSWORD
  // ======================
  async retryPassword(email: string) {
    const user = await this.userRepository.findOneBy({
      email: email.toLowerCase().trim(),
    });

    if (!user?.email) throw new BadRequestException('Email không tồn tại');

    const code = uuidv4();

    await this.userRepository.update(
      { _id: user._id },
      {
        verification_code: code,
        verification_expires: new Date(Date.now() + 10 * 60 * 1000),
      },
    );

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset password',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: code,
      },
    });

    return { _id: user._id, email: user.email };
  }

  // ======================
  // CHANGE PASSWORD
  // ======================
  async changePassword(data: ChangePasswordAuthDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Mật khẩu không khớp');
    }

    const user = await this.userRepository.findOneBy({
      email: data.email.toLowerCase().trim(),
      verification_code: data.code,
      is_deleted: false,
    });

    if (
      !user ||
      !user.verification_expires ||
      new Date() > new Date(user.verification_expires)
    ) {
      throw new BadRequestException('Code không hợp lệ hoặc hết hạn');
    }

    const newPassword = await hashPasswordHelper(data.password);

    await this.userRepository.update(
      { _id: user._id },
      {
        password: newPassword,
        verification_code: null,
        verification_expires: null,
      },
    );

    return { message: 'Đổi mật khẩu thành công' };
  }

  // ======================
  // UPDATE ROLE
  // ======================
  async updateRole(userId: string, role: UserRole) {
    if (!isValidEntityId(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.userRepository.findOneBy({
      _id: userId,
      is_deleted: false,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.userRepository.update({ _id: userId }, { role });

    return { message: 'Update role success' };
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<User>,
    filter: Record<string, unknown>,
  ) {
    const allowedFields = new Set([
      '_id',
      'name',
      'email',
      'phone',
      'account_type',
      'role',
      'is_active',
      'is_deleted',
    ]);
    const operators: Record<string, string> = {
      $eq: '=',
      $ne: '<>',
      $gt: '>',
      $gte: '>=',
      $lt: '<',
      $lte: '<=',
    };

    for (const [field, value] of Object.entries(filter)) {
      if (!allowedFields.has(field) || field === 'is_deleted') {
        continue;
      }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const filterOperators = value as Record<string, unknown>;
        for (const [operator, operand] of Object.entries(filterOperators)) {
          if (operator === '$in' && Array.isArray(operand)) {
            queryBuilder.andWhere(`user.${field} IN (:...${field}_values)`, {
              [`${field}_values`]: operand,
            });
          } else if (operator === '$nin' && Array.isArray(operand)) {
            queryBuilder.andWhere(
              `user.${field} NOT IN (:...${field}_values)`,
              { [`${field}_values`]: operand },
            );
          } else if (operator === '$regex' && typeof operand === 'string') {
            queryBuilder.andWhere(`user.${field} LIKE :${field}_regex`, {
              [`${field}_regex`]: `%${operand.replace(/\.\*/g, '%')}%`,
            });
          } else if (operators[operator]) {
            queryBuilder.andWhere(
              `user.${field} ${operators[operator]} :${field}_value`,
              { [`${field}_value`]: operand },
            );
          }
        }
      } else {
        queryBuilder.andWhere(`user.${field} = :${field}_value`, {
          [`${field}_value`]: value,
        });
      }
    }
  }

  private toFilterRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }
}
