import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request, { params }) {
    try {
        // Reconstruir la ruta del archivo desde los parámetros
        const pathSegments = params.path || [];
        const filePath = pathSegments.join('/');

        // Construir la ruta completa del archivo en public/uploads
        const fullPath = join(process.cwd(), 'public', 'uploads', filePath);

        // Verificar que el archivo existe
        if (!existsSync(fullPath)) {
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

