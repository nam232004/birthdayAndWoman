import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        // Lấy dữ liệu từ request
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const message = formData.get('message') as string || 'Không có tin nhắn';
        const studentId = formData.get('studentId') as string || 'Không có mã số sinh viên';

        if (!file) {
            return NextResponse.json(
                { error: 'Không tìm thấy file' },
                { status: 400 }
            );
        }

        // Chuyển đổi file thành buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Cấu hình transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Cấu hình email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'nam232004@gmail.com',
            to: process.env.EMAIL_USER || 'nam232004@gmail.com',
            subject: `Ảnh từ trang Birthday & Women's Day - MSSV: ${studentId}`,
            text: `Có người đã gửi ảnh cho bạn với thông tin:

Mã số sinh viên: ${studentId}
Tin nhắn: ${message}`,
            attachments: [
                {
                    filename: file.name,
                    content: buffer,
                },
            ],
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        return NextResponse.json(
            { error: 'Có lỗi xảy ra khi gửi email' },
            { status: 500 }
        );
    }
} 
