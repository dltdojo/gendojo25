#!/bin/bash
export XX_JWT_SECRET=$(openssl rand -hex 32)
echo $XX_JWT_SECRET
pnpm dev