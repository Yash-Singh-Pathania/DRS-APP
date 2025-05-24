from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID NOT NULL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "name" VARCHAR(255),
    "password_hash" VARCHAR(255),
    "is_verified" BOOL NOT NULL DEFAULT False,
    "otp" VARCHAR(6),
    "otp_created_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS "coupon" (
    "id" UUID NOT NULL PRIMARY KEY,
    "barcode" VARCHAR(255) NOT NULL,
    "value" DECIMAL(10,2),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "is_used" BOOL NOT NULL DEFAULT False,
    "scanned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMPTZ,
    "user_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
