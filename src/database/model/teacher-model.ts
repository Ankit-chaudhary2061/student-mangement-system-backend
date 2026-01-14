import { Model, Table, Column, DataType, PrimaryKey } from "sequelize-typescript";

// Enum for expertise levels
export enum TeacherExpertise {
  BEGINNER = "beginner",
  MODERATE = "moderate",
  ADVANCE = "advance",
}

@Table({
  tableName: "teachers",
  modelName: "Teacher",
  timestamps: true,
})
export class Teacher extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare teacherName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare teacherEmail: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare teacherPhoto: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [10, 10],
        msg: "Phone number must be exactly 10 digits",
      },
      isNumeric: {
        msg: "Phone number must contain only numbers",
      },
    },
  })
  declare teacherPhoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare teacherAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare teacherExperience: string; // free text about years, etc.

  @Column({
    type: DataType.ENUM(...Object.values(TeacherExpertise)),
    allowNull: false,
  })
  declare teacherExpertise: TeacherExpertise; // enum
}
