import { Resend } from "resend";

import MyLetter from "@/components/email-templates/MyLetter";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST() {
    try {

        const result = await resend.emails.send({
            from: `registration@xn--kostmgenerator-jsb.com`,
            to: "adkirfuglyape@gmail.com",
            subject: `Submission from a Tester`,
            react: MyLetter(),
        });

        return Response.json({ success: true, result });
    } catch (error: unknown) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}