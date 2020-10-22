const {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne} = require('typeorm');
const {Rol} = require('./rol');

@Entity()
class Usuario  {
    @PrimaryGeneratedColumn({type: "int"})
    id;

    @Column({type: "varchar", length: 45})
    codigo;

    @Column({type: "varchar", length: 255})
    correoInstitucional

    @Column({type: "varchar", length: 255, nullable: true})
    hash

    @Column({type: "varchar", length: 255})
    nombres

    @Column({type: "varchar", length: 255})
    apellidos

    @Column({type: "varchar", length: 255, nullable: true})
    correoPersonal

    @Column({type: "varchar", length: 45, nullable: true})
    telefono

    @Column({type: "tinyint", length: 1, nullable: true, default: 1})
    firstTimeLogin

    @ManyToOne(() => Rol, (rol) => rol.usuarios)
    rol

    @CreateDateColumn()
    createdAt

    @UpdateDateColumn()
    updatedAt
}

module.exports = Usuario;