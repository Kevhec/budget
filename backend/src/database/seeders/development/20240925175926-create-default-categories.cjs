const categories = [
  {
    id: crypto.randomUUID(),
    name: 'General',
    isDefault: true,
    color: '#A9A9A9',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Vivienda',
    isDefault: true,
    color: '#FF6F61',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comestibles',
    isDefault: true,
    color: '#6B8E23',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Transporte',
    isDefault: true,
    color: '#4682B4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Entretenimiento',
    isDefault: true,
    color: '#FFB347',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comidas Fuera',
    isDefault: true,
    color: '#F4A460',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Salud',
    isDefault: true,
    color: '#2E8B57',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Cuidado Personal',
    isDefault: true,
    color: '#FF69B4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ropa',
    isDefault: true,
    color: '#9370DB',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Pago de Deudas',
    isDefault: true,
    color: '#8B4513',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ahorros e Inversiones',
    isDefault: true,
    color: '#228B22',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Educación',
    isDefault: true,
    color: '#468499',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Regalos y Donaciones',
    isDefault: true,
    color: '#D2691E',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Seguros',
    isDefault: true,
    color: '#708090',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Suscripciones',
    isDefault: true,
    color: '#FF6347',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Viajes',
    isDefault: true,
    color: '#FFD700',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mascotas',
    isDefault: true,
    color: '#DA70D6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Cuidado Infantil',
    isDefault: true,
    color: '#FF8C00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Deudas',
    isDefault: true,
    color: '#B22222',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Sueldo',
    isDefault: true,
    color: '#32CD32',
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
      await queryInterface.bulkDelete('Users', null, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
