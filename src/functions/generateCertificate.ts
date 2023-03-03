import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import * as handlebars from "handlebars";
import * as path from 'path'
import * as fs from 'fs'
import * as dayjs from 'dayjs'

interface ICreateCertificate {
  id: string;
  name: string;
  grade: string;
}

interface ITemplate {
    id: string
    name: string
    grade: string
    medal: string
    date: string
}


const compile = async  (data: ITemplate) => {
    const filePath = path.join(process.cwd(),"src","templates",  "certificate.hbs");
    const html = fs.readFileSync(filePath, 'utf-8');
    return handlebars.compile(html)(data)
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate;

    await document
    .put({
      TableName: "users_certificate",
      Item: {
        id,
        name,
        grade,
        created_at: new Date().getTime(),
      },
    })
    // .promise();

    const response = await document.query({
        TableName: "users_certificate",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    })//.promise();

    const medalPath = path.join(process.cwd(),"src","templates",  "selo.png")
    const medal = fs.readFileSync(medalPath, "base64")
    const data: ITemplate = {
        name, id,  grade, date: dayjs.format("DD/MM/YYYY"),
        medal: medal
    }

    cosnt content = await compile(data)
    
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: response.Items[0],
    }),
  };
};
