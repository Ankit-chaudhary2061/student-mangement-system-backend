import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";


@Table({
  tableName: "courses",
  modelName: "Course",
  timestamps: true,
})
class Course extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "courseName",
  })
  declare courseName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "courseDescription",
  })
  declare courseDescription: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "courseDuration",
  })
  declare courseDuration: string;


}

export default Course;
