/**
 * Prisma Seed Script
 * 
 * Seeds the database with initial data:
 * - 1 admin user
 * - 1 faculty user
 * - 1 student user
 * - Rooms for Ohio Wesleyan University buildings
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Check if rooms already exist
  const existingRooms = await prisma.room.count()
  const existingUsers = await prisma.user.count()
  
  // Only clear if database is empty (first time setup)
  if (existingRooms === 0 && existingUsers === 0) {
    console.log("🧹 Cleaning existing data (first time setup)...")
    await prisma.auditLog.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.bookingRequest.deleteMany()
    await prisma.room.deleteMany()
    await prisma.user.deleteMany()
  } else {
    console.log(`⚠️  Database already has data (${existingRooms} rooms, ${existingUsers} users)`)
    console.log("📝 Adding new rooms without deleting existing data...")
    // Only delete rooms that don't exist in our seed data
    // This allows adding new rooms without losing existing ones
  }

  // Create users (only if they don't exist)
  console.log("👥 Creating users...")
  
  let admin = await prisma.user.findUnique({ where: { email: "admin@owu.edu" } })
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@owu.edu",
        role: "ADMIN",
        department: "Administration",
      },
    })
    console.log(`✅ Created admin user: ${admin.name}`)
  } else {
    console.log(`⏭️  Admin user already exists: ${admin.name}`)
  }

  let faculty = await prisma.user.findUnique({ where: { email: "jane.smith@owu.edu" } })
  if (!faculty) {
    faculty = await prisma.user.create({
      data: {
        name: "Dr. Jane Smith",
        email: "jane.smith@owu.edu",
        role: "FACULTY",
        department: "Computer Science",
      },
    })
    console.log(`✅ Created faculty user: ${faculty.name}`)
  } else {
    console.log(`⏭️  Faculty user already exists: ${faculty.name}`)
  }

  let student = await prisma.user.findUnique({ where: { email: "john.doe@owu.edu" } })
  if (!student) {
    student = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@owu.edu",
        role: "STUDENT",
        department: "Computer Science",
      },
    })
    console.log(`✅ Created student user: ${student.name}`)
  } else {
    console.log(`⏭️  Student user already exists: ${student.name}`)
  }

  // Create rooms for Ohio Wesleyan University buildings
  console.log("🏢 Creating rooms for OWU buildings...")
  
  const rooms = [
    // Elliott Hall - Main academic building
    { name: "Elliott 101", building: "Elliott Hall", capacity: 30, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 102", building: "Elliott Hall", capacity: 25, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 103", building: "Elliott Hall", capacity: 28, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 104", building: "Elliott Hall", capacity: 22, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 201", building: "Elliott Hall", capacity: 40, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 202", building: "Elliott Hall", capacity: 35, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 203", building: "Elliott Hall", capacity: 32, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 204", building: "Elliott Hall", capacity: 28, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 301", building: "Elliott Hall", capacity: 45, equipment: ["projector", "sound system", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott 302", building: "Elliott Hall", capacity: 38, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Elliott Conference Room", building: "Elliott Hall", capacity: 15, equipment: ["projector", "video conferencing", "whiteboard", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    { name: "Elliott Seminar Room", building: "Elliott Hall", capacity: 12, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    
    // Slocum Hall - Student services and administration
    { name: "Slocum 100", building: "Slocum Hall", capacity: 20, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Slocum 101", building: "Slocum Hall", capacity: 18, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Slocum 102", building: "Slocum Hall", capacity: 16, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Slocum 200", building: "Slocum Hall", capacity: 30, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Slocum 201", building: "Slocum Hall", capacity: 25, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Slocum 202", building: "Slocum Hall", capacity: 22, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Slocum Welcome Center", building: "Slocum Hall", capacity: 10, equipment: ["wifi", "monitor"], restrictedRoles: null },
    { name: "Slocum Meeting Room", building: "Slocum Hall", capacity: 8, equipment: ["wifi", "monitor"], restrictedRoles: ["FACULTY", "ADMIN"] },
    
    // University Hall - Large lecture halls and events
    { name: "University Hall 101", building: "University Hall", capacity: 50, equipment: ["projector", "sound system", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "University Hall 102", building: "University Hall", capacity: 45, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "University Hall 103", building: "University Hall", capacity: 40, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "University Hall 201", building: "University Hall", capacity: 60, equipment: ["projector", "sound system", "microphone", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "University Hall 202", building: "University Hall", capacity: 40, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "University Hall 203", building: "University Hall", capacity: 35, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Gray Chapel", building: "University Hall", capacity: 200, equipment: ["projector", "sound system", "stage", "lighting", "wifi"], restrictedRoles: null },
    { name: "Gray Chapel Balcony", building: "University Hall", capacity: 50, equipment: ["projector", "sound system", "wifi"], restrictedRoles: null },
    
    // Merrick Hall - Business and economics
    { name: "Merrick 101", building: "Merrick Hall", capacity: 35, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Merrick 102", building: "Merrick Hall", capacity: 30, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Merrick 103", building: "Merrick Hall", capacity: 28, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Merrick 201", building: "Merrick Hall", capacity: 40, equipment: ["projector", "video conferencing", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Merrick 202", building: "Merrick Hall", capacity: 25, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Merrick 203", building: "Merrick Hall", capacity: 22, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Merrick Innovation Lab", building: "Merrick Hall", capacity: 20, equipment: ["computers", "projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Merrick Trading Room", building: "Merrick Hall", capacity: 15, equipment: ["computers", "monitors", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    { name: "Merrick Conference Room", building: "Merrick Hall", capacity: 12, equipment: ["projector", "video conferencing", "whiteboard", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    
    // Edwards Gymnasium
    { name: "Edwards Gym Main", building: "Edwards Gymnasium", capacity: 100, equipment: ["sound system", "wifi"], restrictedRoles: null },
    { name: "Edwards Gym Studio A", building: "Edwards Gymnasium", capacity: 30, equipment: ["mirrors", "sound system", "wifi"], restrictedRoles: null },
    { name: "Edwards Gym Studio B", building: "Edwards Gymnasium", capacity: 25, equipment: ["mirrors", "sound system", "wifi"], restrictedRoles: null },
    { name: "Jannuzi Dance Studio", building: "Edwards Gymnasium", capacity: 20, equipment: ["mirrors", "sound system", "wifi"], restrictedRoles: null },
    
    // Stuyvesant Hall
    { name: "Stuyvesant 101", building: "Stuyvesant Hall", capacity: 20, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Stuyvesant 102", building: "Stuyvesant Hall", capacity: 15, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Stuyvesant Common Room", building: "Stuyvesant Hall", capacity: 30, equipment: ["wifi", "monitor"], restrictedRoles: null },
    
    // Sanborn Hall
    { name: "Sanborn 101", building: "Sanborn Hall", capacity: 25, equipment: ["piano", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Sanborn 102", building: "Sanborn Hall", capacity: 20, equipment: ["piano", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Sanborn 201", building: "Sanborn Hall", capacity: 30, equipment: ["piano", "projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Jemison Auditorium", building: "Sanborn Hall", capacity: 150, equipment: ["piano", "projector", "sound system", "stage", "lighting", "wifi"], restrictedRoles: null },
    
    // Schimmel-Conrades Science Center - Sciences
    { name: "Schimmel 101", building: "Schimmel-Conrades Science Center", capacity: 40, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Schimmel 102", building: "Schimmel-Conrades Science Center", capacity: 35, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Schimmel 103", building: "Schimmel-Conrades Science Center", capacity: 32, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Schimmel 104", building: "Schimmel-Conrades Science Center", capacity: 30, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Schimmel Lab 201", building: "Schimmel-Conrades Science Center", capacity: 20, equipment: ["lab equipment", "whiteboard", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    { name: "Schimmel Lab 202", building: "Schimmel-Conrades Science Center", capacity: 20, equipment: ["lab equipment", "whiteboard", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    { name: "Schimmel Lab 203", building: "Schimmel-Conrades Science Center", capacity: 18, equipment: ["lab equipment", "whiteboard", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    { name: "Schimmel Lab 204", building: "Schimmel-Conrades Science Center", capacity: 18, equipment: ["lab equipment", "whiteboard", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    { name: "Schimmel 301", building: "Schimmel-Conrades Science Center", capacity: 50, equipment: ["projector", "sound system", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Schimmel 302", building: "Schimmel-Conrades Science Center", capacity: 45, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Schimmel Observatory", building: "Schimmel-Conrades Science Center", capacity: 15, equipment: ["telescope", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    
    // Phillips Hall
    { name: "Phillips 101", building: "Phillips Hall", capacity: 30, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Phillips 102", building: "Phillips Hall", capacity: 25, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Phillips 201", building: "Phillips Hall", capacity: 35, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Phillips 202", building: "Phillips Hall", capacity: 30, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Phillips Conference Room", building: "Phillips Hall", capacity: 12, equipment: ["projector", "video conferencing", "whiteboard", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    
    // Beeghly Library - Study spaces
    { name: "Library Study Room 1", building: "Beeghly Library", capacity: 4, equipment: ["wifi", "desks"], restrictedRoles: null },
    { name: "Library Study Room 2", building: "Beeghly Library", capacity: 4, equipment: ["wifi", "desks"], restrictedRoles: null },
    { name: "Library Study Room 3", building: "Beeghly Library", capacity: 6, equipment: ["whiteboard", "wifi", "monitor"], restrictedRoles: null },
    { name: "Library Study Room 4", building: "Beeghly Library", capacity: 6, equipment: ["whiteboard", "wifi", "monitor"], restrictedRoles: null },
    { name: "Library Study Room 5", building: "Beeghly Library", capacity: 4, equipment: ["wifi", "desks"], restrictedRoles: null },
    { name: "Library Study Room 6", building: "Beeghly Library", capacity: 6, equipment: ["whiteboard", "wifi", "monitor"], restrictedRoles: null },
    { name: "Library Study Room 7", building: "Beeghly Library", capacity: 8, equipment: ["whiteboard", "wifi", "monitor"], restrictedRoles: null },
    { name: "Library Study Room 8", building: "Beeghly Library", capacity: 8, equipment: ["whiteboard", "wifi", "monitor"], restrictedRoles: null },
    { name: "Library Conference Room", building: "Beeghly Library", capacity: 10, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Library Quiet Room", building: "Beeghly Library", capacity: 8, equipment: ["wifi", "desks"], restrictedRoles: null },
    { name: "Library Media Room", building: "Beeghly Library", capacity: 6, equipment: ["projector", "wifi", "computers"], restrictedRoles: null },
    
    // Richard M. Ross Art Museum - Art and exhibitions
    { name: "Ross Gallery A", building: "Richard M. Ross Art Museum", capacity: 30, equipment: ["wifi", "lighting"], restrictedRoles: null },
    { name: "Ross Gallery B", building: "Richard M. Ross Art Museum", capacity: 25, equipment: ["wifi", "lighting"], restrictedRoles: null },
    { name: "Ross Gallery C", building: "Richard M. Ross Art Museum", capacity: 20, equipment: ["wifi", "lighting"], restrictedRoles: null },
    { name: "Ross Studio", building: "Richard M. Ross Art Museum", capacity: 15, equipment: ["art supplies", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    { name: "Ross Workshop Room", building: "Richard M. Ross Art Museum", capacity: 12, equipment: ["art supplies", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    
    // Hayes Hall - Modern languages and literature
    { name: "Hayes 101", building: "Hayes Hall", capacity: 25, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Hayes 102", building: "Hayes Hall", capacity: 22, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Hayes 201", building: "Hayes Hall", capacity: 30, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Hayes 202", building: "Hayes Hall", capacity: 28, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Hayes Language Lab", building: "Hayes Hall", capacity: 20, equipment: ["computers", "headsets", "projector", "wifi"], restrictedRoles: null },
    { name: "Hayes Seminar Room", building: "Hayes Hall", capacity: 12, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    
    // Hamilton-Williams Campus Center - Student activities
    { name: "HWCC Ballroom", building: "Hamilton-Williams Campus Center", capacity: 150, equipment: ["projector", "sound system", "stage", "lighting", "wifi"], restrictedRoles: null },
    { name: "HWCC Conference Room A", building: "Hamilton-Williams Campus Center", capacity: 20, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "HWCC Conference Room B", building: "Hamilton-Williams Campus Center", capacity: 15, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "HWCC Meeting Room 1", building: "Hamilton-Williams Campus Center", capacity: 10, equipment: ["wifi", "monitor"], restrictedRoles: null },
    { name: "HWCC Meeting Room 2", building: "Hamilton-Williams Campus Center", capacity: 8, equipment: ["wifi", "monitor"], restrictedRoles: null },
    { name: "HWCC Student Lounge", building: "Hamilton-Williams Campus Center", capacity: 30, equipment: ["wifi", "tv"], restrictedRoles: null },
    
    // Chappelear Drama Center - Theater and performing arts
    { name: "Chappelear Main Stage", building: "Chappelear Drama Center", capacity: 120, equipment: ["stage", "lighting", "sound system", "wifi"], restrictedRoles: null },
    { name: "Chappelear Black Box", building: "Chappelear Drama Center", capacity: 50, equipment: ["stage", "lighting", "sound system", "wifi"], restrictedRoles: null },
    { name: "Chappelear Rehearsal Room A", building: "Chappelear Drama Center", capacity: 20, equipment: ["mirrors", "sound system", "wifi"], restrictedRoles: null },
    { name: "Chappelear Rehearsal Room B", building: "Chappelear Drama Center", capacity: 18, equipment: ["mirrors", "sound system", "wifi"], restrictedRoles: null },
    { name: "Chappelear Costume Shop", building: "Chappelear Drama Center", capacity: 10, equipment: ["sewing equipment", "wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    
    // Branch Rickey Arena - Athletics and events
    { name: "Branch Rickey Main Court", building: "Branch Rickey Arena", capacity: 200, equipment: ["sound system", "scoreboard", "wifi"], restrictedRoles: null },
    { name: "Branch Rickey Meeting Room", building: "Branch Rickey Arena", capacity: 25, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Branch Rickey Locker Room A", building: "Branch Rickey Arena", capacity: 15, equipment: ["wifi"], restrictedRoles: ["FACULTY", "ADMIN"] },
    
    // Austin Manor - Residential and meeting spaces
    { name: "Austin Manor Common Room", building: "Austin Manor", capacity: 25, equipment: ["wifi", "tv"], restrictedRoles: null },
    { name: "Austin Manor Study Room", building: "Austin Manor", capacity: 8, equipment: ["wifi", "desks"], restrictedRoles: null },
    
    // Welch Hall - Additional academic space
    { name: "Welch 101", building: "Welch Hall", capacity: 30, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Welch 102", building: "Welch Hall", capacity: 25, equipment: ["whiteboard", "wifi"], restrictedRoles: null },
    { name: "Welch 201", building: "Welch Hall", capacity: 35, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
    { name: "Welch 202", building: "Welch Hall", capacity: 28, equipment: ["projector", "whiteboard", "wifi"], restrictedRoles: null },
  ]

  const createdRooms = []
  let skippedCount = 0
  
  for (const roomData of rooms) {
    // Check if room already exists
    const existingRoom = await prisma.room.findFirst({
      where: {
        name: roomData.name,
        building: roomData.building,
      },
    })
    
    if (existingRoom) {
      console.log(`⏭️  Skipping existing room: ${roomData.name} (${roomData.building})`)
      skippedCount++
      createdRooms.push(existingRoom)
      continue
    }
    
    const room = await prisma.room.create({
      data: {
        name: roomData.name,
        building: roomData.building,
        capacity: roomData.capacity,
        equipment: JSON.stringify(roomData.equipment), // Convert array to JSON string
        images: JSON.stringify([]), // Convert array to JSON string
        restrictedRoles: roomData.restrictedRoles ? JSON.stringify(roomData.restrictedRoles) : null,
        isActive: true,
        isLocked: false,
      },
    })
    createdRooms.push(room)
    console.log(`✅ Created room: ${room.name} (${room.building})`)
  }

  const totalRooms = createdRooms.length
  const totalBuildings = new Set(rooms.map(r => r.building)).size
  const newRooms = totalRooms - skippedCount
  
  console.log(`✅ Rooms summary: ${totalRooms} total (${newRooms} new, ${skippedCount} existing) across ${totalBuildings} buildings`)

  // Create some sample booking requests (optional)
  console.log("📅 Creating sample booking requests...")
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  const dayAfter = new Date(tomorrow)
  dayAfter.setHours(12, 0, 0, 0)

  const bookingRequest = await prisma.bookingRequest.create({
    data: {
      roomId: createdRooms[0].id,
      userId: faculty.id,
      startAt: tomorrow,
      endAt: dayAfter,
      purpose: "Faculty meeting",
      status: "PENDING",
    },
  })

  console.log(`✅ Created sample booking request: ${bookingRequest.id}`)

  // Create an audit log entry
  console.log("📝 Creating audit log entry...")
  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      actionType: "SEED_COMPLETED",
      targetType: "System",
      targetId: null,
      reason: "Database seeded with initial data",
    },
  })

  console.log("✅ Seed completed successfully!")
  console.log("\n📊 Summary:")
  console.log(`   - Users: 3 (1 admin, 1 faculty, 1 student)`)
  console.log(`   - Rooms: ${createdRooms.length}`)
  console.log(`   - Buildings: ${new Set(rooms.map(r => r.building)).size}`)
  console.log(`   - Booking Requests: 1`)
  console.log(`   - Audit Logs: 1`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
