import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    // 1. جلب الـ ID من الرابط (URL)
    const url = new URL(req.url)
    const bookingId = url.searchParams.get('id')

    if (!bookingId) throw new Error('Booking ID is required')

    // 2. الاتصال بقاعدة البيانات
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. تحديث حالة الحجز
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' }) // تأكدي أن اسم العمود status والقيمة confirmed
      .eq('id', bookingId)

    if (error) throw error

    // 4. رسالة نجاح تظهر في المتصفح عند الضغط
    return new Response(
      `<html><body style="font-family:sans-serif; text-align:center; padding-top:50px;">
        <h1 style="color: #4CAF50;">✅ تم تأكيد الحجز بنجاح!</h1>
        <p>رقم الحجز: ${bookingId}</p>
        <p>يمكن للمستخدم الآن رؤية الحجز في لوحة التحكم الخاصة به.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html; charset=UTF-8" } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})