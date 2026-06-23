# Guia de Implantação — Projeto Mãos que Ajudam

## Pré-requisitos

- Node.js 18+
- Conta Google Cloud
- Conta Vercel (gratuita)

---

## 1. Configurar Google Sheets

### 1.1 Criar a Planilha

Crie uma planilha Google Sheets com esta estrutura na aba **Planilha1**:

| A (Ala)      | B (Item)               | C (Quantidade) |
|--------------|------------------------|---------------|
| Prosind      | Fralda Geriátrica XXG  | 12            |
| Mangabeira 1 | Sabonete Líquido       | 3             |
| Geisel       | Farinha Láctea         | 7             |

**Nomes de Itens aceitos:**
- Fralda Geriátrica XXG
- Fralda Geriátrica XG
- Fralda Infantil P/M
- Desinfetante Dragão
- Sabonete Líquido para Mãos
- Sabonete Líquido Infantil
- Farinha Láctea
- Neston
- Biscoito Maria / Cream Cracker

---

### 1.2 Criar Service Account no Google Cloud

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto (ou use um existente)
3. Ative a **Google Sheets API**: APIs e Serviços → Biblioteca → "Google Sheets API"
4. Crie uma Service Account: APIs e Serviços → Credenciais → Criar Credenciais → Conta de Serviço
5. Dê um nome (ex: `maos-que-ajudam`)
6. Gere uma chave JSON: clique na conta criada → Chaves → Adicionar Chave → JSON
7. Guarde o arquivo JSON gerado

### 1.3 Compartilhar a Planilha

1. Abra sua planilha Google Sheets
2. Clique em **Compartilhar**
3. Adicione o e-mail da service account (ex: `maos-que-ajudam@projeto.iam.gserviceaccount.com`)
4. Permissão: **Visualizador**

---

## 2. Configurar o Projeto Localmente

```bash
# Clone ou entre na pasta do projeto
cd maos-que-ajudam

# Instale dependências
npm install

# Copie o arquivo de exemplo
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
GOOGLE_SHEET_ID=<ID da planilha — aparece na URL após /d/>
GOOGLE_SHEET_RANGE=Planilha1!A2:C
GOOGLE_SERVICE_ACCOUNT_EMAIL=<e-mail da service account>
GOOGLE_SERVICE_ACCOUNT_KEY="<chave privada do JSON — copie o campo private_key>"
```

> **Dica:** A chave privada tem quebras de linha. No `.env.local` substitua cada `\n` real por `\n` literal (dois caracteres).

### Rodar localmente

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## 3. Deploy na Vercel

### 3.1 Via CLI

```bash
npm install -g vercel
vercel login
vercel
```

### 3.2 Via Dashboard (recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **New Project**
3. Importe o repositório GitHub com o projeto
4. Configure as **Environment Variables**:

| Nome | Valor |
|------|-------|
| `GOOGLE_SHEET_ID` | ID da sua planilha |
| `GOOGLE_SHEET_RANGE` | `Planilha1!A2:C` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | E-mail da service account |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Chave privada (com `\n` literais) |

5. Clique em **Deploy**

---

## 4. Modo de Demonstração (sem planilha)

Se as variáveis de ambiente não estiverem configuradas, a aplicação usa **dados mockados** automaticamente para demonstração. Nenhuma configuração adicional é necessária.

---

## 5. Atualização dos Dados

Os dados são buscados da planilha:
- **Automaticamente** a cada 60 segundos
- **Manualmente** pelo botão de refresh no cabeçalho

---

## 6. Adicionando Novas Alas

Basta adicionar linhas na planilha com o nome da nova ala. O sistema detecta automaticamente. Para personalizar a cor da ala, edite `src/lib/sheets.ts` no objeto `ALA_COLORS`.

---

## Suporte

Dúvidas? Entre em contato com a coordenação da Estaca Rangel 2026.
