// src/common/filters/prisma-exception.fiter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@travel-management-system/database';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    const getDetailedErrorMessage = (baseMessage: string): string => {
      let detailedMessage = baseMessage;
      if (exception.meta) {
        Object.entries(exception.meta).forEach(([key, value]) => {
          detailedMessage += ` ${key}: ${JSON.stringify(value)}.`;
        });
      }
      return detailedMessage;
    };

    switch (exception.code) {
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          "The provided value for the column is too long for the column's type.",
        );
        break;
      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        message = getDetailedErrorMessage(
          'The record searched for in the where condition does not exist.',
        );
        break;
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = getDetailedErrorMessage(
          `Unique constraint failed on the field(s): ${(exception.meta?.target as string[])?.join(', ')}.`,
        );
        break;
      case 'P2003':
        status = HttpStatus.CONFLICT;
        message = getDetailedErrorMessage(
          `Foreign key constraint failed on the field: ${exception.meta?.field_name as string}.`,
        );
        break;
      case 'P2004':
        status = HttpStatus.CONFLICT;
        message = getDetailedErrorMessage(
          'A constraint failed on the database.',
        );
        break;
      case 'P2005':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          "The value stored in the database for the field is invalid for the field's type.",
        );
        break;
      case 'P2006':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          'The provided value for the field is not valid.',
        );
        break;
      case 'P2007':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage('Data validation error.');
        break;
      case 'P2008':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage('Failed to parse the query.');
        break;
      case 'P2009':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage('Failed to validate the query.');
        break;
      case 'P2010':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage('Raw query failed.');
        break;
      case 'P2011':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          `Null constraint violation on the field: ${exception.meta?.target as string}.`,
        );
        break;
      case 'P2012':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          'Missing a required field or value is invalid.',
        );
        break;
      case 'P2013':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          `Missing the required argument: ${exception.meta?.argument_name as string}.`,
        );
        break;
      case 'P2014':
        status = HttpStatus.CONFLICT;
        message = getDetailedErrorMessage(
          'The change you are trying to make would violate the required relation between the models.',
        );
        break;
      case 'P2015':
        status = HttpStatus.NOT_FOUND;
        message = getDetailedErrorMessage(
          'A related record could not be found.',
        );
        break;
      case 'P2016':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage('Query interpretation error.');
        break;
      case 'P2017':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          'The records for the relation between the models are not connected.',
        );
        break;
      case 'P2018':
        status = HttpStatus.NOT_FOUND;
        message = getDetailedErrorMessage(
          'The required connected records were not found.',
        );
        break;
      case 'P2019':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage('Input error.');
        break;
      case 'P2020':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage('Value out of range for the type.');
        break;
      case 'P2021':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage(
          'The table does not exist in the current database.',
        );
        break;
      case 'P2022':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage(
          'The column does not exist in the current database.',
        );
        break;
      case 'P2023':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage('Inconsistent column data.');
        break;
      case 'P2024':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage(
          'Timed out fetching a new connection from the connection pool.',
        );
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = getDetailedErrorMessage(
          'An operation failed because it depends on one or more records that were required but not found.',
        );
        break;
      case 'P2026':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          "The current database provider doesn't support a feature that the query used.",
        );
        break;
      case 'P2027':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage(
          'Multiple errors occurred on the database during query execution.',
        );
        break;
      case 'P2028':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage('Transaction API error.');
        break;
      case 'P2030':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          'Cannot find a fulltext index to use for the search.',
        );
        break;
      case 'P2031':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage(
          'Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set.',
        );
        break;
      case 'P2033':
        status = HttpStatus.BAD_REQUEST;
        message = getDetailedErrorMessage(
          'A number used in the query does not fit into a 64 bit signed integer.',
        );
        break;
      case 'P2034':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = getDetailedErrorMessage(
          'Transaction failed due to a write conflict or a deadlock.',
        );
        break;
      default:
        message = getDetailedErrorMessage(exception.message);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.name,
      code: exception.code,
    });
  }
}
