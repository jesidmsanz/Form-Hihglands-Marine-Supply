import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

export async function GET(request, { params }) {
    try {
        // ✅ FIX: await params porque es una Promise en Next.js 13+
        const resolvedParams = await params;
        const pathSegments = resolvedParams.path || [];
        const filePath = pathSegments.join('/');

        // Validar que no intenten acceder a rutas peligrosas
        if (filePath.includes('..') || filePath.startsWith('/')) {
            return new NextResponse('Invalid path', { status: 400 });
        }

        // Construir la ruta completa del archivo en public/uploads
        const fullPath = join(process.cwd(), 'public', 'uploads', filePath);

        // ✅ FIX: Verificar que es un ARCHIVO, no un directorio
        try {
            const stats = await stat(fullPath);
            if (stats.isDirectory()) {
                console.error('Path is a directory, not a file:', fullPath);
                return new NextResponse('File not found', { status: 404 });
            }
        } catch (err) {
            console.error('File not found:', fullPath);
            return new NextResponse('File not found', { status: 404 });
        }

        // Leer el archivo
        const fileBuffer = await readFile(fullPath);

        // Determinar el tipo MIME basado en la extensión
        const extension = filePath.split('.').pop()?.toLowerCase();
        const mimeTypes = {
            pdf: 'application/pdf',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xls: 'application/vnd.ms-excel',
        };

        const contentType = mimeTypes[extension] || 'application/octet-stream';
        const fileName = filePath.split('/').pop();

        // Retornar el archivo con los headers apropiados
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Length': fileBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return new NextResponse('Error serving file', { status: 500 });
    }
}