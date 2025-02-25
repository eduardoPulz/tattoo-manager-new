import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        employee: true,
        service: true,
      },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const schedule = await prisma.schedule.create({
      data: {
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        clientName: data.clientName,
        employeeId: data.employeeId,
        serviceId: data.serviceId,
      },
      include: {
        employee: true,
        service: true,
      },
    });
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
