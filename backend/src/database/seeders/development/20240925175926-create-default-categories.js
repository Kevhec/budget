const categories = [
  {
    id: crypto.randomUUID(),
    name: 'General',
    color: '#A9A9A9',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Vivienda',
    color: '#FF6F61',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comestibles',
    color: '#6B8E23',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Transporte',
    color: '#4682B4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Entretenimiento',
    color: '#FFB347',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comidas Fuera',
    color: '#F4A460',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Salud',
    color: '#2E8B57',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Cuidado Personal',
    color: '#FF69B4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ropa',
    color: '#9370DB',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Pago de Deudas',
    color: '#8B4513',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ahorros e Inversiones',
    color: '#228B22',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Educación',
    color: '#468499',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Regalos y Donaciones',
    color: '#D2691E',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Seguros',
    color: '#708090',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Suscripciones',
    color: '#FF6347',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Viajes',
    color: '#FFD700',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mascotas',
    color: '#DA70D6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Cuidado Infantil',
    color: '#FF8C00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const t = await queryInterface.sequelize.transaction();

    try {
      console.log('TRYING');
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
