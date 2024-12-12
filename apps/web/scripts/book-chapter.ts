import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
const prisma = new PrismaClient()

const InitialID = "8c767f6e-b2c8-4cf9-a02f-d5714dcc13ba"

function generateUniqueSlug(baseSlug: string): string {
  return `${baseSlug}-typescript`
}

async function createChapters() {
  try {
    // Create Chapter 10
    const chapter10 = await prisma.bookChapter.create({
      data: {
        title: "Testing in TypeScript",
        description: "Comprehensive guide to testing TypeScript applications",
        slug: generateUniqueSlug("testing-typescript"),
        order: 10,
        bookId: InitialID,
      }
    })

    // Section 10.1: Unit Testing
    await prisma.bookSection.create({
      data: {
        title: "Unit Testing",
        description: "Writing and managing unit tests in TypeScript",
        slug: generateUniqueSlug("unit-testing"),
        order: 1,
        bookChapterId: chapter10.id,
        bookId: InitialID,
        bookSubSections: {
          create: [
            {
              title: "Jest with TypeScript",
              description: "Setting up and using Jest for TypeScript testing",
              slug: generateUniqueSlug("jest-typescript"),
              order: 1,
            },
            {
              title: "Writing Test Cases",
              description: "Best practices for writing effective test cases",
              slug: generateUniqueSlug("test-cases"),
              order: 2,
            },
            {
              title: "Test Coverage",
              description: "Measuring and improving test coverage",
              slug: generateUniqueSlug("test-coverage"),
              order: 3,
            },
            {
              title: "Mocking in TypeScript",
              description: "Creating and using mocks in tests",
              slug: generateUniqueSlug("mocking"),
              order: 4,
            }
          ]
        }
      }
    })

    // Section 10.2: Integration Testing
    await prisma.bookSection.create({
      data: {
        title: "Integration Testing",
        description: "Implementing integration tests for TypeScript applications",
        slug: generateUniqueSlug("integration-testing"),
        order: 2,
        bookChapterId: chapter10.id,
        bookId: InitialID,
        bookSubSections: {
          create: [
            {
              title: "API Testing",
              description: "Testing REST and GraphQL APIs",
              slug: generateUniqueSlug("api-testing"),
              order: 1,
            },
            {
              title: "Database Testing",
              description: "Testing database interactions",
              slug: generateUniqueSlug("database-testing"),
              order: 2,
            },
            {
              title: "End-to-End Testing",
              description: "Implementing E2E tests with Cypress",
              slug: generateUniqueSlug("e2e-testing"),
              order: 3,
            },
            {
              title: "Test Environments",
              description: "Setting up and managing test environments",
              slug: generateUniqueSlug("test-environments"),
              order: 4,
            }
          ]
        }
      }
    })

    // Create Chapter 11
    const chapter11 = await prisma.bookChapter.create({
      data: {
        title: "Real-World Application Development",
        description: "Building production-ready applications with TypeScript",
        slug: generateUniqueSlug("real-world-apps"),
        order: 11,
        bookId: InitialID,
      }
    })

    // Section 11.1: Application Architecture
    await prisma.bookSection.create({
      data: {
        title: "Application Architecture",
        description: "Designing scalable TypeScript applications",
        slug: generateUniqueSlug("app-architecture"),
        order: 1,
        bookChapterId: chapter11.id,
        bookId: InitialID,
        bookSubSections: {
          create: [
            {
              title: "Project Structure",
              description: "Organizing large-scale TypeScript projects",
              slug: generateUniqueSlug("project-structure"),
              order: 1,
            },
            {
              title: "Design Patterns",
              description: "Implementing common design patterns",
              slug: generateUniqueSlug("design-patterns"),
              order: 2,
            },
            {
              title: "State Management",
              description: "Managing application state effectively",
              slug: generateUniqueSlug("state-management"),
              order: 3,
            },
            {
              title: "API Integration",
              description: "Integrating with backend services",
              slug: generateUniqueSlug("api-integration"),
              order: 4,
            }
          ]
        }
      }
    })

    // Section 11.2: Performance Optimization
    await prisma.bookSection.create({
      data: {
        title: "Performance Optimization",
        description: "Optimizing TypeScript applications for production",
        slug: generateUniqueSlug("performance-optimization"),
        order: 2,
        bookChapterId: chapter11.id,
        bookId: InitialID,
        bookSubSections: {
          create: [
            {
              title: "Build Optimization",
              description: "Optimizing TypeScript compilation and bundling",
              slug: generateUniqueSlug("build-optimization"),
              order: 1,
            },
            {
              title: "Runtime Performance",
              description: "Improving application runtime performance",
              slug: generateUniqueSlug("runtime-performance"),
              order: 2,
            },
            {
              title: "Memory Management",
              description: "Managing memory usage effectively",
              slug: generateUniqueSlug("memory-management"),
              order: 3,
            },
            {
              title: "Code Splitting",
              description: "Implementing effective code splitting",
              slug: generateUniqueSlug("code-splitting"),
              order: 4,
            }
          ]
        }
      }
    })

    // Create Chapter 12
    const chapter12 = await prisma.bookChapter.create({
      data: {
        title: "Advanced TypeScript Patterns",
        description: "Advanced patterns and best practices for TypeScript development",
        slug: generateUniqueSlug("advanced-patterns"),
        order: 12,
        bookId: InitialID,
      }
    })

    // Section 12.1: Design Patterns
    await prisma.bookSection.create({
      data: {
        title: "Advanced Design Patterns",
        description: "Implementing sophisticated design patterns in TypeScript",
        slug: generateUniqueSlug("advanced-design-patterns"),
        order: 1,
        bookChapterId: chapter12.id,
        bookId: InitialID,
        bookSubSections: {
          create: [
            {
              title: "Factory Pattern",
              description: "Implementing factory patterns in TypeScript",
              slug: generateUniqueSlug("factory-pattern"),
              order: 1,
            },
            {
              title: "Singleton Pattern",
              description: "Creating singleton patterns properly",
              slug: generateUniqueSlug("singleton-pattern"),
              order: 2,
            },
            {
              title: "Observer Pattern",
              description: "Implementing the observer pattern",
              slug: generateUniqueSlug("observer-pattern"),
              order: 3,
            },
            {
              title: "Dependency Injection",
              description: "Using dependency injection effectively",
              slug: generateUniqueSlug("dependency-injection"),
              order: 4,
            }
          ]
        }
      }
    })

    // Section 12.2: Best Practices
    await prisma.bookSection.create({
      data: {
        title: "Production Best Practices",
        description: "Professional TypeScript development practices",
        slug: generateUniqueSlug("production-practices"),
        order: 2,
        bookChapterId: chapter12.id,
        bookId: InitialID,
        bookSubSections: {
          create: [
            {
              title: "Code Quality",
              description: "Maintaining high code quality standards",
              slug: generateUniqueSlug("code-quality"),
              order: 1,
            },
            {
              title: "Security Practices",
              description: "Implementing security best practices",
              slug: generateUniqueSlug("security-practices"),
              order: 2,
            },
            {
              title: "Documentation",
              description: "Writing effective documentation",
              slug: generateUniqueSlug("documentation"),
              order: 3,
            },
            {
              title: "Deployment Strategies",
              description: "Strategies for deploying TypeScript applications",
              slug: generateUniqueSlug("deployment-strategies"),
              order: 4,
            }
          ]
        }
      }
    })

    console.log('Successfully created Final Chapters content')

  } catch (error) {
    console.error('Error creating chapters:', error)
    throw error
  }
}
// Execute the function
createChapters()
  .then(() => {
    console.log('Script completed successfully')
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })