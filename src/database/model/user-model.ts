import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";
import { UserRole } from "../../middleware/auth-middleware";

interface UserCreate {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model<UserCreate> {

  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ allowNull: false })
  declare username: string;

  @Column({ allowNull: false, unique: false })
  declare email: string;

  @Column({ allowNull: false })
  declare password: string;

  @Column({
    type: DataType.ENUM("admin", "teacher", "student"),
    defaultValue: UserRole.STUDENT,
  })
  declare role: UserRole;
}
