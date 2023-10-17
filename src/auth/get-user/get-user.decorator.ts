import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/entities/User.entity';

export const GetUser = createParamDecorator((data, req): User => {
  const request = req.switchToHttp().getRequest();

  return request.user;
});

// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { User } from 'src/entities/user.entity';

// export const GetUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): User => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user;
//   },
// );
