import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = "retcainecsnkyqfxzmjk";
serve(async (req: Request) => {
  try {
    const { record } = await req.json() // سوبابيس يرسل البيانات داخل كائن اسمه record

    // تخصيص محتوى الإيميل
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Ewan Booking <onboarding@resend.dev>', // اتركها هكذا حالياً للتجربة
to: ["samera64178@gmail.com"], // ايميلك اللي في ريسيند        subject: 'تأكيد حجزك في إيوان 🏰',
        html: `
          <div style="font-family: sans-serif; direction: rtl; text-align: center; border: 1px solid #d4af37; padding: 20px;">
            <h1 style="color: #1a237e;">تم استلام طلب حجزك!</h1>
            <p>شكراً لاختيارك إيوان. رقم حجزك هو: <strong>${record.id}</strong></p>
            <a href="http://localhost:3000/confirm-booking?id=${record.id}" 
               style="background-color: #d4af37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               اضغط هنا لتأكيد الحجز
            </a>
          </div>
        `,
      }),
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 })
  }
})