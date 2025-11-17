# 🚀 Pipeline CI/CD - Ze da Fruta Backend

## 📋 Visão Geral

Este documento descreve o pipeline de CI/CD implementado no backend do Ze da Fruta utilizando GitHub Actions.

## 🏗️ Estrutura do Pipeline

O pipeline está configurado no arquivo `.github/workflows/ci-backend.yml` e é dividido em 3 jobs principais:

### 1️⃣ **Test** - Testes e Cobertura
- ✅ Executa em múltiplas versões do Node.js (18.x e 20.x)
- ✅ Roda linter (ESLint)
- ✅ Executa testes unitários
- ✅ Gera relatório de cobertura
- ✅ Faz upload da cobertura para Codecov

### 2️⃣ **Build** - Build da Aplicação
- ✅ Depende do job de testes (só executa se testes passarem)
- ✅ Compila a aplicação NestJS
- ✅ Verifica se o build foi gerado corretamente

### 3️⃣ **Security** - Análise de Segurança
- ✅ Executa auditoria de segurança (npm audit)
- ✅ Verifica vulnerabilidades críticas
- ✅ Continua mesmo com vulnerabilidades moderadas

## 🎯 Gatilhos (Triggers)

O pipeline é executado automaticamente em:
- **Push** para branches `main` e `develop`
- **Pull Requests** para branches `main` e `develop`

## 📊 Cobertura de Testes

### Estado Inicial
- **Cobertura**: 0%
- **Testes**: Nenhum teste implementado

### Estado Atual
- ✅ **Primeiro teste criado**: `categoria.service.spec.ts`
- ✅ **11 testes implementados** cobrindo:
  - Listagem de categorias públicas
  - Listagem de todas as categorias
  - Obtenção por ID
  - Criação de categoria
  - Atualização de categoria
  - Exclusão (soft delete) de categoria
  - Tratamento de erros (NotFoundException)

## 🧪 Executando os Testes Localmente

### Todos os testes
```bash
npm test
```

### Testes com cobertura
```bash
npm run test:cov
```

### Testes específicos
```bash
npm test -- categoria.service.spec.ts
```

### Modo watch
```bash
npm run test:watch
```

## 📁 Estrutura de Testes

```
src/
└── 2-sales/
    └── application/
        └── services/
            ├── categoria.service.ts
            └── categoria.service.spec.ts  ✅ NOVO
```

## 🔍 O que foi testado

### CategoriaService
- ✅ Inicialização do serviço
- ✅ Listagem de categorias ativas (público)
- ✅ Listagem de todas as categorias (admin)
- ✅ Busca por ID (sucesso e falha)
- ✅ Criação de nova categoria
- ✅ Atualização de categoria existente
- ✅ Exclusão (desativação) de categoria
- ✅ Tratamento de erros para registros inexistentes

## 📈 Próximos Passos

### Aumentar Cobertura
1. Adicionar testes para outros services:
   - `produto.service.ts`
   - `pedido.service.ts`
   - `cupom.service.ts`
   - `estabelecimento.service.ts`

2. Adicionar testes de integração
3. Adicionar testes E2E
4. Meta: atingir 80%+ de cobertura

### Melhorias no Pipeline
1. Adicionar job de deploy automático
2. Integrar com Docker
3. Adicionar notificações (Slack/Discord)
4. Implementar deploy preview para PRs

## 🛠️ Tecnologias Utilizadas

- **Testing Framework**: Jest
- **CI/CD**: GitHub Actions
- **Framework**: NestJS
- **Language**: TypeScript
- **Coverage**: Istanbul (via Jest)

## 📝 Convenções de Testes

### Nomenclatura
- Arquivos de teste: `*.spec.ts`
- Localização: ao lado do arquivo testado
- Describe blocks: nome da classe/função
- Test cases: começam com "deve..."

### Estrutura
```typescript
describe('NomeDoService', () => {
  // Setup
  beforeEach(async () => {
    // Configurar módulo de teste
  });

  describe('nomeDoMetodo', () => {
    it('deve fazer algo esperado', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## 🎉 Resultado

✅ **Pipeline configurado com sucesso!**
✅ **Primeiro teste criado e funcionando!**
✅ **11 testes passando!**
✅ **Cobertura inicial estabelecida!**

---

*Última atualização: 17 de novembro de 2025*
