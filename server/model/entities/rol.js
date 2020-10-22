const {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} = require('typeorm');
const {Usuario} = require('./usuario');

@Entity()
class Rol {
    @PrimaryGeneratedColumn()
    id

    @Column({type: "varchar", length: 45})
    nombre

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    usuarios

    @CreateDateColumn()
    createdAt

    @UpdateDateColumn()
    updatedAt
}

module.exports = Rol;