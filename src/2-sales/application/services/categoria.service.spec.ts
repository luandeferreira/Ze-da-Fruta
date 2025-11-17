import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../../domain/entities/categoria.entity';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: Repository<Categoria>;
  let eventEmitter: EventEmitter2;

  const mockCategoria: Partial<Categoria> = {
    id: '1',
    nome: 'Frutas',
    descricao: 'Frutas frescas e selecionadas',
    ativo: true,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: getRepositoryToken(Categoria),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repository = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('listarCategoriasPublico', () => {
    it('deve retornar apenas categorias ativas', async () => {
      const categoriasAtivas = [
        { ...mockCategoria, id: '1', nome: 'Frutas' },
        { ...mockCategoria, id: '2', nome: 'Verduras' },
      ];

      mockRepository.find.mockResolvedValue(categoriasAtivas);

      const result = await service.listarCategoriasPublico();

      expect(result).toEqual(categoriasAtivas);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        order: { nome: 'ASC' },
      });
    });

    it('deve retornar array vazio quando não há categorias ativas', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.listarCategoriasPublico();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('obterCategoriaPorId', () => {
    it('deve retornar uma categoria quando encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategoria);

      const result = await service.obterCategoriaPorId('1');

      expect(result).toEqual(mockCategoria);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve lançar NotFoundException quando categoria não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.obterCategoriaPorId('999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.obterCategoriaPorId('999')).rejects.toThrow(
        'Categoria com ID 999 não encontrada',
      );
    });
  });

  describe('listarCategorias', () => {
    it('deve retornar todas as categorias (ativas e inativas)', async () => {
      const todasCategorias = [
        { ...mockCategoria, id: '1', ativo: true },
        { ...mockCategoria, id: '2', ativo: false },
      ];

      mockRepository.find.mockResolvedValue(todasCategorias);

      const result = await service.listarCategorias();

      expect(result).toEqual(todasCategorias);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { nome: 'ASC' },
      });
    });
  });

  describe('criarCategoria', () => {
    it('deve criar uma nova categoria com sucesso', async () => {
      const dadosCategoria = {
        nome: 'Legumes',
        descricao: 'Legumes frescos',
      };

      const novaCategoria = {
        ...dadosCategoria,
        id: '3',
        ativo: true,
      };

      mockRepository.create.mockReturnValue(novaCategoria);
      mockRepository.save.mockResolvedValue(novaCategoria);

      const result = await service.criarCategoria(dadosCategoria);

      expect(result).toEqual(novaCategoria);
      expect(mockRepository.create).toHaveBeenCalledWith({
        nome: dadosCategoria.nome,
        descricao: dadosCategoria.descricao,
        ativo: true,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(novaCategoria);
    });
  });

  describe('atualizarCategoria', () => {
    it('deve atualizar uma categoria existente', async () => {
      const dadosAtualizacao = {
        nome: 'Frutas Tropicais',
        descricao: 'Frutas tropicais importadas',
      };

      const categoriaAtualizada = {
        ...mockCategoria,
        ...dadosAtualizacao,
      };

      mockRepository.findOne.mockResolvedValue(mockCategoria);
      mockRepository.save.mockResolvedValue(categoriaAtualizada);

      const result = await service.atualizarCategoria(
        {},
        '1',
        dadosAtualizacao,
      );

      expect(result).toEqual(categoriaAtualizada);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve lançar erro ao tentar atualizar categoria inexistente', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.atualizarCategoria({}, '999', { nome: 'Teste' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('excluirCategoria', () => {
    it('deve desativar uma categoria (soft delete)', async () => {
      const categoriaDesativada = {
        ...mockCategoria,
        ativo: false,
      };

      mockRepository.findOne.mockResolvedValue(mockCategoria);
      mockRepository.save.mockResolvedValue(categoriaDesativada);

      await service.excluirCategoria({}, '1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockRepository.save).toHaveBeenCalled();
      
      // Verifica que a categoria foi desativada
      const savedCategoria = mockRepository.save.mock.calls[0][0];
      expect(savedCategoria.ativo).toBe(false);
    });

    it('deve lançar erro ao tentar excluir categoria inexistente', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.excluirCategoria({}, '999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
