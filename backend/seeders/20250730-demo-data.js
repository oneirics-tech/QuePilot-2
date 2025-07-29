const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Businesses
    const business1Id = uuidv4();
    const business2Id = uuidv4();

    await queryInterface.bulkInsert('Businesses', [
      {
        id: business1Id,
        name: 'Fresh Fades Barbershop',
        logo: null,
        primaryColor: '#1D4ED8',
        secondaryColor: '#10B981',
        fontFamily: 'Inter',
        assignmentMode: 'stick_and_serve',
        allowMultipleCustomers: false,
        settings: JSON.stringify({}),
        createdAt: now,
        updatedAt: now
      },
      {
        id: business2Id,
        name: 'Tax Pro Hub',
        logo: null,
        primaryColor: '#7C3AED',
        secondaryColor: '#F59E0B',
        fontFamily: 'Roboto',
        assignmentMode: 'flow_and_flex',
        allowMultipleCustomers: true,
        settings: JSON.stringify({}),
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Admins
    await queryInterface.bulkInsert('Admins', [
      {
        id: uuidv4(),
        businessId: business1Id,
        email: 'admin1@freshfades.com',
        password: await bcrypt.hash('Password123!', 10),
        name: 'Fresh Admin',
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        businessId: business2Id,
        email: 'admin2@taxprohub.com',
        password: await bcrypt.hash('SecurePass456!', 10),
        name: 'Tax Admin',
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Employees
    const employee1Id = uuidv4();
    const employee2Id = uuidv4();
    const employee3Id = uuidv4();
    const employee4Id = uuidv4();

    await queryInterface.bulkInsert('Employees', [
      {
        id: employee1Id,
        businessId: business1Id,
        name: 'Barber John',
        initials: 'BJ',
        pin: '1234',
        isAvailable: true,
        lastCheckIn: now,
        lastCheckOut: null,
        profileImage: null,
        activeCustomerCount: 0,
        createdAt: now,
        updatedAt: now
      },
      {
        id: employee2Id,
        businessId: business1Id,
        name: 'Barber Lisa',
        initials: 'BL',
        pin: '2345',
        isAvailable: false,
        lastCheckIn: null,
        lastCheckOut: null,
        profileImage: null,
        activeCustomerCount: 0,
        createdAt: now,
        updatedAt: now
      },
      {
        id: employee3Id,
        businessId: business2Id,
        name: 'Agent Mike',
        initials: 'AM',
        pin: '3456',
        isAvailable: true,
        lastCheckIn: now,
        lastCheckOut: null,
        profileImage: null,
        activeCustomerCount: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: employee4Id,
        businessId: business2Id,
        name: 'Agent Nina',
        initials: 'AN',
        pin: '4567',
        isAvailable: true,
        lastCheckIn: now,
        lastCheckOut: null,
        profileImage: null,
        activeCustomerCount: 1,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Workflows
    await queryInterface.bulkInsert('Workflows', [
      {
        id: uuidv4(),
        businessId: business1Id,
        name: 'Default Barber Workflow',
        steps: JSON.stringify([
          { id: 'check_in', name: 'Check-In', order: 1 },
          { id: 'assigned', name: 'Assigned', order: 2, required: true },
          { id: 'checkout', name: 'Checkout', order: 3 }
        ]),
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        businessId: business2Id,
        name: 'Tax Prep Workflow',
        steps: JSON.stringify([
          { id: 'check_in', name: 'Check-In', order: 1 },
          { id: 'assigned', name: 'Assigned', order: 2, required: true },
          { id: 'intake', name: 'Intake', order: 3 },
          { id: 'prep', name: 'Prep', order: 4 },
          { id: 'review', name: 'Review', order: 5 },
          { id: 'checkout', name: 'Checkout', order: 6 }
        ]),
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Customers
    await queryInterface.bulkInsert('Customers', [
      {
        id: uuidv4(),
        businessId: business1Id,
        name: 'Customer Alpha',
        email: 'alpha@example.com',
        reason: 'Fade & Beard Trim',
        queueNumber: 1,
        status: 'waiting',
        assignedEmployeeId: null,
        currentWorkflowStep: 'check_in',
        checkInTime: now,
        assignmentTime: null,
        readyTime: null,
        completionTime: null,
        completedBy: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        businessId: business2Id,
        name: 'Customer Beta',
        email: 'beta@example.com',
        reason: 'Tax Filing',
        queueNumber: 1,
        status: 'assigned',
        assignedEmployeeId: employee3Id,
        currentWorkflowStep: 'assigned',
        checkInTime: now,
        assignmentTime: now,
        readyTime: null,
        completionTime: null,
        completedBy: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        businessId: business2Id,
        name: 'Customer Gamma',
        email: 'gamma@example.com',
        reason: 'Back Taxes',
        queueNumber: 2,
        status: 'in_progress',
        assignedEmployeeId: employee4Id,
        currentWorkflowStep: 'prep',
        checkInTime: now,
        assignmentTime: now,
        readyTime: now,
        completionTime: null,
        completedBy: null,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ActivityLogs', null, {});
    await queryInterface.bulkDelete('Customers', null, {});
    await queryInterface.bulkDelete('Workflows', null, {});
    await queryInterface.bulkDelete('Employees', null, {});
    await queryInterface.bulkDelete('Admins', null, {});
    await queryInterface.bulkDelete('Businesses', null, {});
  }
};
