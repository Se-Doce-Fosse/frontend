#!/bin/sh

# Obtém o nome da branch atual
branch=$(git symbolic-ref --short HEAD 2>/dev/null)

# Verifica se estamos em uma branch válida
if [ -z "$branch" ]; then
  echo "Erro: Não foi possível determinar a branch atual."
  exit 1
fi

# Exceções: branches principais não precisam seguir o padrão
if [ "$branch" = "main" ] || [ "$branch" = "develop" ]; then
  echo "✅ Branch '$branch' é uma branch principal (exceção permitida)."
  exit 0
fi

# Verifica se a branch segue o padrão: (feat|bugfix|chore)/números-descrição
if echo "$branch" | grep -qE "^(feat|bugfix|chore)/[0-9]+(-.*)?$"; then
  echo "✅ Nome da branch '$branch' está válido."
  exit 0
else
  echo "❌ Nome da branch '$branch' é inválido!"
  echo ""
  echo "📋 Padrão esperado:"
  echo "   • feat/número-ticket[-descrição] (ex: feat/123, feat/456-adicionar-login)"
  echo "   • bugfix/número-ticket[-descrição] (ex: bugfix/789, bugfix/101-corrigir-validacao)"
  echo "   • chore/número-ticket[-descrição] (ex: chore/42, chore/999-atualizar-dependencias)"
  echo ""
  echo "🚀 Exceções permitidas:"
  echo "   • main (branch principal)"
  echo "   • develop (branch de desenvolvimento)"
  echo ""
  echo "🔧 Renomeie sua branch usando:"
  echo "   git branch -m nome-atual-da-branch <novo-nome-valido>"
  echo ""
  exit 1
fi
