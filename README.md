# Ledes Weekly Report

Bem-vindo ao projeto Ledes Weekly Report! Este é um projeto de TCC que utiliza o Supabase como banco de dados e o Next.js como framework front-end. Antes de começar, siga as instruções abaixo para configurar o ambiente e iniciar o projeto.

## Configuração do Ambiente

1. Crie um arquivo chamado `.env` na raiz do projeto.
2. Acesse o painel do Supabase e obtenha as credenciais necessárias para preencher o arquivo `.env`. Você encontrará essas informações na seção de configurações do projeto.

```env
NEXT_PUBLIC_SUPABASE_URL==sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_de_api
```


## Inicialização do Projeto

1. Utilize o SQL editor disponível no painel do Supabase para executar o script SQL de esquema localizado em ``/supabase/schema.sql`` no seu banco de dados. Isso criará a estrutura necessária para o projeto.
2. Ainda no painel do Supabase, execute o seguinte script:
```
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profile (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
3. Agora, você está pronto para iniciar o projeto Ledes Weekly Report utilizando o Next.js! Execute os seguintes comandos:

```
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

```

## Instruções adicionais para deploy na Vercel (opcional):

Caso deseje fazer o deploy na Vercel, siga estas instruções:

1. Certifique-se de ter uma conta na Vercel (https://vercel.com/).

2. Instale a CLI da Vercel globalmente, se ainda não tiver:
```
npm install -g vercel
```
3.  Execute o comando de deploy na raiz do projeto:
```
vercel
```
4.  Siga as instruções para configurar o projeto na Vercel.