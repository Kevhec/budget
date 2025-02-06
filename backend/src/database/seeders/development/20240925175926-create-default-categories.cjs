const categories = [
  // Default Categories
  {
    id: crypto.randomUUID(),
    type: 'general',
    name: 'General',
    isDefault: true,
    color: '#A9A9A9',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Expense Categories
  {
    id: crypto.randomUUID(),
    name: 'Vivienda',
    type: 'expense',
    isDefault: true,
    color: '#FF6F61',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comestibles',
    type: 'expense',
    isDefault: true,
    color: '#6B8E23',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Transporte',
    type: 'expense',
    isDefault: true,
    color: '#4682B4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Entretenimiento',
    type: 'expense',
    isDefault: true,
    color: '#FFB347',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comidas Fuera',
    type: 'expense',
    isDefault: true,
    color: '#F4A460',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Salud',
    type: 'expense',
    isDefault: true,
    color: '#2E8B57',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Cuidado Personal',
    type: 'expense',
    isDefault: true,
    color: '#FF69B4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ropa',
    type: 'expense',
    isDefault: true,
    color: '#9370DB',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Pago de Deudas',
    type: 'expense',
    isDefault: true,
    color: '#8B4513',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ahorros e Inversiones',
    type: 'expense',
    isDefault: true,
    color: '#228B22',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Educación',
    type: 'expense',
    isDefault: true,
    color: '#468499',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Regalos',
    type: 'expense',
    isDefault: true,
    color: '#D2691E',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Donaciones',
    type: 'expense',
    isDefault: true,
    color: '#DAA520',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Seguros',
    type: 'expense',
    isDefault: true,
    color: '#708090',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Suscripciones',
    type: 'expense',
    isDefault: true,
    color: '#FF6347',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Viajes',
    type: 'expense',
    isDefault: true,
    color: '#FFD700',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mascotas',
    type: 'expense',
    isDefault: true,
    color: '#DA70D6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Cuidado Infantil',
    type: 'expense',
    isDefault: true,
    color: '#FF8C00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Deudas',
    type: 'expense',
    isDefault: true,
    color: '#B22222',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: crypto.randomUUID(),
    name: 'Servicios Públicos',
    type: 'expense',
    isDefault: true,
    color: '#20B2AA',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Impuestos',
    type: 'expense',
    isDefault: true,
    color: '#CD5C5C',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mantenimiento del Auto',
    type: 'expense',
    isDefault: true,
    color: '#808080',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Reparaciones del Hogar',
    type: 'expense',
    isDefault: true,
    color: '#8FBC8F',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Gimnasio',
    type: 'expense',
    isDefault: true,
    color: '#4169E1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Electrónicos',
    type: 'expense',
    isDefault: true,
    color: '#9932CC',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comisiones Bancarias',
    type: 'expense',
    isDefault: true,
    color: '#778899',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Income Categories
  {
    id: crypto.randomUUID(),
    name: 'Sueldo',
    type: 'income',
    isDefault: true,
    color: '#32CD32',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ingresos por Inversiones',
    type: 'income',
    isDefault: true,
    color: '#228B22',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Bonificaciones',
    type: 'income',
    isDefault: true,
    color: '#FFD700',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Trabajo Independiente',
    type: 'income',
    isDefault: true,
    color: '#00CED1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Alquiler',
    type: 'income',
    isDefault: true,
    color: '#8A2BE2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const t = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert('categories', categories, { t });
      await t.commit();
    } catch (error) {
      console.error(error.message);
      await t.rollback();
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('categories', null, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
