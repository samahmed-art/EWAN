import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record; // بيانات الحجز الجديد

    // 1. الاتصال بسوبابيس بصلاحيات الأدمن (Service Role)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. التعديل الجوهري: جلب إيميل المستخدم من نظام Auth مباشرة
    // هذا يضمن الحصول على الإيميل حتى لو كان جدول profiles فارغاً
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(record.user_id);

    if (authError || !authData?.user?.email) {
      console.error("خطأ في الوصول لنظام Auth:", authError);
      throw new Error("لم يتم العثور على إيميل للمستخدم في نظام Auth");
    }

    const userEmail = authData.user.email;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    // 3. إرسال الإيميل للديناميكي (userEmail)
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ewan <onboarding@resend.dev>",
        to: [userEmail], 
        subject: "تأكيد حجزك في إيوان 🏰",
        html: `
          <div style="direction: rtl; text-align: center; font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h1 style="color: #1a237e;">مرحباً!</h1>
            <p>لقد تلقينا طلب حجزك بنجاح وهو الآن قيد المراجعة.</p>
            <p>رقم الحجز: <strong style="color: #ff5722;">${record.id}</strong></p>
            <br>
            <p>هذا الرابط مخصص للأدمن لتفعيل الحجز:</p>
            <a href="https://retcainecsnkyqfxzmjk.supabase.co/functions/v1/confirm-booking?id=${record.id}" 
               style="background-color: #1a237e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
               تأكيد الحجز الآن ✅
            </a>
          </div>
        `,
      }),
    });

    const result = await res.json();
    return new Response(JSON.stringify(result), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
})