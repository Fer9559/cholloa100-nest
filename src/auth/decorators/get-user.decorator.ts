import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        return 'Hola mundo'
    }
)