import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { Subscriber, SubscriberModel } from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobModel } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private readonly mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private readonly subscriberModel: SubscriberModel,

    @InjectModel(Job.name)
    private readonly jobModel: JobModel
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  testCron(){
    
  }

  @Get()
  @Public()
  @Cron("0 0 0 * * 0")//0 0/00 every day sunday * * 0
  @ResponseMessage("Test email")
  async handleTestEmail() {
    

    const subscribers = await this.subscriberModel.find({  });
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      console.log("subsSkills",subsSkills);
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      console.log("jobWithMatchingSkills",jobWithMatchingSkills);
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((job) => {
          return {
            name: job.name,
            company: job.company.name,
            salary: `${job.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: job.skills
          }
        })
        await this.mailerService.sendMail({
          to: "azcosong09@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job', // `.hbs` extension is appended automatically
          context: { // ✏️ filling curly brackets with content
            receiver: subs.name,
            url: 'https://niceapp.com',
            jobs: jobs
          },
        });
      }
      //todo
      //build template
    }
  }


}
