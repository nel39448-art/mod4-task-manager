-- CreateTable
CREATE TABLE "Tarea" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "completada" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tarea_pkey" PRIMARY KEY ("id")
);
