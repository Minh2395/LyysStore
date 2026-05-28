import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '../../helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from '../../auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone } = createUserDto;

    // check email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`,
      );
    }

    // hash password
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
    });

    return {
      _id: user._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totlalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totlalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    console.log('RESULTS:', results);
    console.log('TOTAL PAGES:', totalPages);

    return { results, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(_id: string) {
    // check id
    if (mongoose.isValidObjectId(_id)) {
      // delete
      return this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Id không đúng định dạng mongodb');
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;

    // check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(
        `Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`,
      );
    }

    // hash password
    const hashPassword = await hashPasswordHelper(password);
    const verification_code = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      is_active: false,
      verification_code: verification_code,
      verification_expires: new Date(Date.now() + 10 * 60 * 1000),
    });

    // send email
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at @lyysstore',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: verification_code,
      },
    });

    return {
      _id: user._id,
    };
  }

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

  async retryActive(email: string) {
    // check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    if (user.is_active) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    const verification_code = uuidv4();

    // update user
    await user.updateOne({
      verification_code: verification_code,
      verification_expires: new Date(Date.now() + 10 * 60 * 1000),
    });

    // resend Email
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at @lyysstore',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: verification_code,
      },
    });

    return {
      _id: user._id,
    };
  }

  async retryPassword(email: string) {
    // check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    const verification_code = uuidv4();

    // update user
    await user.updateOne({
      verification_code: verification_code,
      verification_expires: new Date(Date.now() + 10 * 60 * 1000),
    });

    // resend Email
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Change your password account at @lyysstore',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: verification_code,
      },
    });

    return {
      _id: user._id,
      email: user.email,
    };
  }

  async changePassword(data: ChangePasswordAuthDto) {
    // check confirm password
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException('Mật khẩu và xác nhận mật khẩu không khớp');
    }

    // find user
    const user = await this.userModel.findOne({
      email: data.email,
      verification_code: data.code,
    });

    if (!user) {
      throw new BadRequestException('Email hoặc mã xác thực không hợp lệ');
    }

    // check code expire
    const isBeforeCheck =
      new Date().getTime() < new Date(user.verification_expires).getTime();

    if (!isBeforeCheck) {
      throw new BadRequestException('Mã xác thực đã hết hạn');
    }

    // hash new password
    const newPassword = await hashPasswordHelper(data.password);

    // update password
    await this.userModel.updateOne(
      { _id: user._id },
      {
        password: newPassword,
        verification_code: null,
        verification_expires: null,
      },
    );

    return {
      message: 'Đổi mật khẩu thành công',
    };
  }
}
