-- CreateTable
CREATE TABLE "public"."Hogar" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pin_lista_compra" CHAR(4),
    "configuracion_desayunos" TEXT NOT NULL DEFAULT 'uniforme',

    CONSTRAINT "Hogar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Miembro" (
    "id" TEXT NOT NULL,
    "hogar_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_nacimiento" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" INTEGER NOT NULL,
    "trabajo_tipo" TEXT NOT NULL,
    "horas_cardio_semanal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "horas_fuerza_semanal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "horas_deportes_semanal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "horas_moderado_semanal" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Miembro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ingrediente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "grupo_alimentario" TEXT NOT NULL,
    "kcal_100g" DOUBLE PRECISION NOT NULL,
    "proteinas_100g" DOUBLE PRECISION NOT NULL,
    "carbohidratos_100g" DOUBLE PRECISION NOT NULL,
    "grasas_100g" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plato" (
    "id" TEXT NOT NULL,
    "hogar_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_plato" TEXT NOT NULL DEFAULT 'flex',
    "tipo_comida" TEXT NOT NULL,

    CONSTRAINT "Plato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plato_Ingrediente" (
    "plato_id" TEXT NOT NULL,
    "ingrediente_id" TEXT NOT NULL,
    "cantidad_base" DOUBLE PRECISION NOT NULL,
    "unidad_medida" TEXT NOT NULL,

    CONSTRAINT "Plato_Ingrediente_pkey" PRIMARY KEY ("plato_id","ingrediente_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingrediente_nombre_key" ON "public"."Ingrediente"("nombre");

-- AddForeignKey
ALTER TABLE "public"."Miembro" ADD CONSTRAINT "Miembro_hogar_id_fkey" FOREIGN KEY ("hogar_id") REFERENCES "public"."Hogar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plato" ADD CONSTRAINT "Plato_hogar_id_fkey" FOREIGN KEY ("hogar_id") REFERENCES "public"."Hogar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plato_Ingrediente" ADD CONSTRAINT "Plato_Ingrediente_plato_id_fkey" FOREIGN KEY ("plato_id") REFERENCES "public"."Plato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plato_Ingrediente" ADD CONSTRAINT "Plato_Ingrediente_ingrediente_id_fkey" FOREIGN KEY ("ingrediente_id") REFERENCES "public"."Ingrediente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
