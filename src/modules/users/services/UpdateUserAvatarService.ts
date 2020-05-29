import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

import uploadConfig from '@config/upload';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      // deletar avatar anterior
      // path.join une dois caminhos (diretorio padrao onde esta todas as fotos + o nome da foto que veio pelo banco de dados)
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      // promisses permite usar funcoes no formato de promisses obviu
      // o stat retorna um status caso o arquivo exista
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    // como o user ja esta vinco completo do banco de dados basta setar o novo avatar e salvar novamente no banco de dados
    user.avatar = avatarFilename;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
