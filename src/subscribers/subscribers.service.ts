import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberModel } from './schemas/subscriber.schema';


@Injectable()
export class SubscribersService {
  constructor( @InjectModel(Subscriber.name) private subscriberModel: SubscriberModel){}
      async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
        const { email, name, skills } = createSubscriberDto;
        const newSubscriber = await this.subscriberModel.create({
          email,
          name,
          skills,
          createdBy: {
            _id: user._id,
            email: user.email,
          },
        })

  }

  findAll() {
    return `This action returns all subscribers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriber`;
  }

  update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const { email, name, skills } = updateSubscriberDto;
    return this.subscriberModel.updateOne({email: email}, {...updateSubscriberDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    },{upsert: true});
  }

  remove(id: number) {
    return `This action removes a #${id} subscriber`;
  }

  getSkills(user : IUser) {
    return this.subscriberModel.findOne({email: user.email}, {skills: 1});

  }
}
