const categories = [
  // Default Categories
  {
    id: crypto.randomUUID(),
    name: 'General',
    isDefault: true,
    color: '#A9A9A9', // Neutral gray for default
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Expense Categories
  {
    id: crypto.randomUUID(),
    name: 'Vivienda',
    isDefault: true,
    color: '#FF6F61', // Coral (kept, works well)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comestibles',
    isDefault: true,
    color: '#6B8E23', // Olive Green (kept, earthy and fitting)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Transporte',
    isDefault: true,
    color: '#4682B4', // Steel Blue (kept, calming and professional)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Entretenimiento',
    isDefault: true,
    color: '#FFB347', // Pastel Orange (kept, vibrant and fun)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comidas Fuera',
    isDefault: true,
    color: '#F4A460', // Sandy Brown (kept, warm and food-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Salud',
    isDefault: true,
    color: '#2E8B57', // Sea Green (kept, fresh and health-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Cuidado Personal',
    isDefault: true,
    color: '#FF69B4', // Hot Pink (kept, playful and fitting)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ropa',
    isDefault: true,
    color: '#9370DB', // Medium Purple (kept, stylish and unique)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Pago de Deudas',
    isDefault: true,
    color: '#8B4513', // Saddle Brown (kept, serious and grounded)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ahorros e Inversiones',
    isDefault: true,
    color: '#228B22', // Forest Green (kept, growth-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Educación',
    isDefault: true,
    color: '#468499', // Teal Blue (kept, calming and intellectual)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Regalos',
    isDefault: true,
    color: '#D2691E', // Chocolate (kept, warm and gift-like)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Donaciones',
    isDefault: true,
    color: '#DAA520', // Goldenrod (new, distinct from Regalos)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Seguros',
    isDefault: true,
    color: '#708090', // Slate Gray (kept, neutral and professional)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Suscripciones',
    isDefault: true,
    color: '#FF6347', // Tomato (kept, vibrant and attention-grabbing)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Viajes',
    isDefault: true,
    color: '#FFD700', // Gold (kept, luxurious and travel-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mascotas',
    isDefault: true,
    color: '#DA70D6', // Orchid (kept, playful and pet-friendly)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Cuidado Infantil',
    isDefault: true,
    color: '#FF8C00', // Dark Orange (kept, warm and family-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Deudas',
    isDefault: true,
    color: '#B22222', // Firebrick (kept, urgent and serious)
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // New Categories
  {
    id: crypto.randomUUID(),
    name: 'Servicios Públicos',
    isDefault: true,
    color: '#20B2AA', // Light Sea Green (fresh and utility-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Impuestos',
    isDefault: true,
    color: '#CD5C5C', // Indian Red (serious and tax-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mantenimiento del Auto',
    isDefault: true,
    color: '#808080', // Gray (neutral and mechanical)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Reparaciones del Hogar',
    isDefault: true,
    color: '#8FBC8F', // Dark Sea Green (home-related and calming)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Gimnasio',
    isDefault: true,
    color: '#4169E1', // Royal Blue (energetic and fitness-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Electrónicos',
    isDefault: true,
    color: '#9932CC', // Dark Orchid (techy and modern)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Comisiones Bancarias',
    isDefault: true,
    color: '#778899', // Light Slate Gray (neutral and financial)
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Income Categories
  {
    id: crypto.randomUUID(),
    name: 'Sueldo',
    isDefault: true,
    color: '#32CD32', // Lime Green (kept, fresh and income-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Ingresos por Inversiones',
    isDefault: true,
    color: '#228B22', // Forest Green (growth-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Bonificaciones',
    isDefault: true,
    color: '#FFD700', // Gold (luxurious and bonus-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Trabajo Independiente',
    isDefault: true,
    color: '#00CED1', // Dark Turquoise (modern and freelance-related)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Alquiler',
    isDefault: true,
    color: '#8A2BE2', // Blue Violet (unique and income-related)
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
