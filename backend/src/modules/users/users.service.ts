import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  AccountType,
  UserRole,
} from './schemas/user.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

import { hashPasswordHelper } from '../../helpers/util';

import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from '../../auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
  ) {}

  // ======================
  // EMAIL CHECK
  // ======================
  async isEmailExist(email: string) {
    return !!(await this.userModel.exists({
      email,
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

    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,

      role: UserRole.USER,
      account_type: AccountType.LOCAL,

      is_active: true,
    });

    return { _id: user._id };
  }

  // ======================
  // FIND ALL
  // ======================
  async findAll(query: string, current = 1, pageSize = 10) {
    const { filter, sort } = aqp(query);

    delete filter.current;
    delete filter.pageSize;

    filter.is_deleted = false;

    const totalItems = await this.userModel.countDocuments(filter);

    const results = await this.userModel
      .find(filter)
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .select('-password')
      .sort(sort as any);

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
    return this.userModel
      .findOne({ email, is_deleted: false })
      .select('+password');
  }

  // ======================
  // FIND BY ID
  // ======================
  async findById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const user = await this.userModel
      .findOne({ _id: id, is_deleted: false })
      .select('-password');

    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }

    return user;
  }

  // ======================
  // UPDATE USER
  // ======================
  async update(dto: any) {
    const { _id, name, email, phone } = dto;

    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const user = await this.userModel.findOne({
      _id,
      is_deleted: false,
    });

    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }

    if (email && email !== user.email) {
      const existed = await this.userModel.findOne({
        email,
        _id: { $ne: _id },
        is_deleted: false,
      });

      if (existed) {
        throw new BadRequestException('Email đã tồn tại');
      }
    }

    await this.userModel.updateOne(
      { _id },
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
      },
    );

    return { message: 'Update thành công' };
  }

  // ======================
  // SOFT DELETE
  // ======================
  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const user = await this.userModel.findOne({
      _id,
      is_deleted: false,
    });

    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }

    await this.userModel.updateOne(
      { _id },
      {
        is_deleted: true,
        deleted_at: new Date(),
      },
    );

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

    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,

      role: UserRole.USER,
      account_type: AccountType.LOCAL,

      is_active: false,
      verification_code: code,
      verification_expires: new Date(Date.now() + 10 * 60 * 1000),
    });

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at @lyysstore',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: code,
      },
    });

    return { _id: user._id };
  }

  // ======================
  // ACTIVE ACCOUNT
  // ======================
  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      verification_code: data.code,
    });

    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }

    // check expire
    const isBeforeCheck =
      new Date().getTime() < new Date(user.verification_expires).getTime();

    if (!isBeforeCheck) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }

    // activate account
    await this.userModel.updateOne(
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
    const user = await this.userModel.findOne({
      email,
      is_deleted: false,
    });

    if (!user) throw new BadRequestException('Email không tồn tại');
    if (user.is_active) throw new BadRequestException('Đã kích hoạt');

    const code = uuidv4();

    await this.userModel.updateOne(
      { _id: user._id },
      {
        verification_code: code,
        verification_expires: new Date(Date.now() + 10 * 60 * 1000),
      },
    );

    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate account',
      template: 'register',
      context: {
        name: user.name || email,
        activationCode: code,
      },
    });

    return { _id: user._id };
  }

  // ======================
  // RETRY PASSWORD
  // ======================
  async retryPassword(email: string) {
    const user = await this.userModel.findOne({
      email,
      is_deleted: false,
    });

    if (!user) throw new BadRequestException('Email không tồn tại');

    const code = uuidv4();

    await this.userModel.updateOne(
      { _id: user._id },
      {
        verification_code: code,
        verification_expires: new Date(Date.now() + 10 * 60 * 1000),
      },
    );

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      template: 'register',
      context: {
        name: user.name || email,
        activationCode: code,
      },
    });

    return { _id: user._id, email };
  }

  // ======================
  // CHANGE PASSWORD
  // ======================
  async changePassword(data: ChangePasswordAuthDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Mật khẩu không khớp');
    }

    const user = await this.userModel.findOne({
      email: data.email,
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

    await this.userModel.updateOne(
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
    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.userModel.findOne({
      _id: userId,
      is_deleted: false,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.userModel.updateOne({ _id: userId }, { role });

    return { message: 'Update role success' };
  }
}
