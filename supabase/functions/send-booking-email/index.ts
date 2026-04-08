import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
const projectUrl = "https://retcainecsnkyqfxzmjk.supabase.co"; 

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

   const RESEND_API_KEY = "re_KABEtNcL_1AjrvM8oDxVCddAncjmmJomP";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ewan <onboarding@resend.dev>",
        to: ["samahmed212003@gmail.com"], // ايميلك اللي في ريسيند
        subject: "تأكيد حجز جديد في إيوان 🏰", // الحقل اللي كان ناقص!
   html: `
    <div style="direction: rtl; text-align: center; font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #1a237e;">تم استلام حجز جديد!</h2>
      <p>رقم الحجز: <strong style="color: #ff5722;">${record?.id}</strong></p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      
      <p>يرجى مراجعة الطلب وتأكيده عبر الضغط على الزر أدناه:</p>
     // استبدلي [PROJECT_ID] بمعرف مشروعك الموجود في رابط سوبابيس عندك

// داخل الـ HTML في الكود:
<a href="${projectUrl}/functions/v1/confirm-booking?id=${record.id}" 
   style="background-color: #1a237e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
   تأكيد الحجز الآن ✅
</a>
      <p style="font-size: 12px; color: #777; margin-top: 25px;">إذا لم تقم بهذا الطلب، يرجى تجاهل هذا الإيميل.</p>
    </div>
        `,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
})