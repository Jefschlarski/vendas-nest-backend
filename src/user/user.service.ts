import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from './enum/user-type.enum';
import { PersistenceContract } from '../interfaces/persistence.contract';
import { UpdatePasswordDto } from './dto/update.password';
import { validatePassword } from '../utils/autenticate';

@Injectable()
export class UserService implements PersistenceContract<User> {

   constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
   ){}
   
    /**
     * Create a new user with the provided user data.
     *
     * @param {UserDto} userDto - the user data to create the user with
     * @return {Promise<User>} a promise that resolves to the newly created user
     */
    async create(userDto: UserDto): Promise<User>
    {
        const user = await this.findByEmail(userDto.email).catch(() => undefined)

        if(user){
            throw new BadRequestException('email já está em uso')
        }

        const saltOrRounds = 10;
        const passwordHashed = await hash(userDto.password, saltOrRounds);  

        return this.userRepository.save(
            {
                ...userDto,
                typeUser: UserType.User,
                password: passwordHashed
            })
    }

    /**
     * Retrieve all users from the repository.
     *
     * @return {Promise<User[]>} The list of all users
     */
    async findAll(): Promise<User[]>{
        return this.userRepository.find();
    }

    /**
     * Async function to get user relations by user id.
     *
     * @param {number} userId - The user ID
     * @return {Promise<User>} The user with relations
     */
    async getUserRelations(userId: number): Promise<User>{
        let user = await this.findById(userId)
        if (!user) {
            throw new NotFoundException(`User Not Found`);
        }
        return this.userRepository.findOne({
            where:{
                id:userId
            },
            relations:{
                addresses:{
                    city:{
                        state: true,
                    }
                }
            }
        })
    }  

    /**
     * Retrieves a user by their ID.
     *
     * @param {number} userId - the ID of the user to retrieve
     * @return {Promise<User>} the user with the specified ID
     */
    async findById(userId: number): Promise<User>{

        const user = await this.userRepository.findOne({
            where:{
                id:userId
            }
        })
        
        if(!user){
            throw new NotFoundException(`userId ${userId} Not Found`)
        }

        return user;
    }

    /**
     * Retrieves a user by their email address.
     *
     * @param {string} email - The email address of the user
     * @return {Promise<User>} The user object
     */
    async findByEmail(email: string): Promise<User>{

        const user = await this.userRepository.findOne({
            where:{
                email:email
            }
        })
        
        if(!user){
            throw new NotFoundException(`Email Not Found`)
        }

        return user;
    }
    
    async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto): Promise<User> {
        const user = await this.findById(id);
        const passwordHashed = await hash(updatePasswordDto.newPassword, 10);
        const isMatch = await validatePassword(updatePasswordDto.oldPassword, user.password || '');
        const isSame = await validatePassword(updatePasswordDto.newPassword, user.password || '');

        if(isSame){
            throw new BadRequestException('new password is the same as old password');
           
        }

        if(!isMatch){
            throw new BadRequestException('Password invalid');
        }

        return this.userRepository.save({...user, password: passwordHashed});   
    }

    update(id: number, item: User): Promise<User> {
        throw new Error('Method not implemented.');
    }
    delete(id: number): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

}
