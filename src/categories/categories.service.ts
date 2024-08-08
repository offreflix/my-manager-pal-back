import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: createCategoryDto,
      });

      return category;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Category already exists');
      }

      throw error;
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany();

      return categories;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.prisma.category.findUnique({ where: { id } });

      return category;
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });

      return category;
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.prisma.category.delete({ where: { id } });

      return deleted;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Category not found');
      }

      return error;
    }
  }
}
