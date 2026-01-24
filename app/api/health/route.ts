import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    const startTime = Date.now();
    let dbStatus = 'disconnected';

    try {
        // Attempt to connect to the database
        await dbConnect();

        // Check the actual connection state
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        dbStatus = states[mongoose.connection.readyState] || 'unknown';

        if (mongoose.connection.readyState === 1) {
            return NextResponse.json(
                {
                    status: 'healthy',
                    database: {
                        status: 'connected',
                        latency: `${Date.now() - startTime}ms`,
                    },
                    timestamp: new Date().toISOString(),
                    uptime: `${process.uptime().toFixed(2)}s`,
                    environment: process.env.NODE_ENV,
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    status: 'unhealthy',
                    database: {
                        status: dbStatus,
                    },
                    timestamp: new Date().toISOString(),
                    uptime: `${process.uptime().toFixed(2)}s`,
                },
                { status: 503 }
            );
        }
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json(
            {
                status: 'unhealthy',
                database: {
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
                timestamp: new Date().toISOString(),
                uptime: `${process.uptime().toFixed(2)}s`,
            },
            { status: 503 }
        );
    }
}
