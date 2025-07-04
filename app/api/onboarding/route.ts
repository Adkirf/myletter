import ConfirmationTemplate from "@/components/email-templates/confirmation-tempate";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // fallback just in case


export async function GET(request: Request) {

    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        const name = searchParams.get("name");
        const newsletters = searchParams.get('newsletters');
        const subscribedNewsletter = newsletters ? JSON.parse(decodeURIComponent(newsletters)) : [];

        if (!email || !name) {
            return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
        }



        await resend.emails.send({
            from: "onboarding@xn--kostmgenerator-jsb.com",
            to: email,
            subject: "Hello " + name + "!",
            react: ConfirmationTemplate({
                userEmail: email,
                userName: name,
                subscribedNewsletter: subscribedNewsletter
            }) as React.ReactElement,
        });

        return NextResponse.json({ message: "Follow-up email sent successfully!" });
    } catch (error: unknown) {
        console.error("Error sending follow-up email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}



export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, forwardingEmail, emailList, email } = body;

        if (!name || !forwardingEmail || !emailList) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        // Capitalize first letter of name
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();


        const emails = emailList
            .split("\n")
            .map((email: string) => email.trim())
            .filter((email: string) => email);

        // Convert emails to subscribed newsletter domains
        const subscribedNewsletter = emails
            .map((email: string) => {
                const atIndex = email.indexOf('@');
                const lastDotIndex = email.lastIndexOf('.');

                if (atIndex === -1 || lastDotIndex === -1 || lastDotIndex <= atIndex) {
                    return null; // Invalid email format
                }

                const domain = email.substring(atIndex + 1, lastDotIndex);
                return domain.charAt(0).toUpperCase() + domain.slice(1);
            })
            .filter((domain: string | null) => domain !== null)
            .filter((domain: string, index: number, arr: string[]) => arr.indexOf(domain) === index); // Remove duplicates



        const result = await resend.emails.send({
            from: `registration@xn--kostmgenerator-jsb.com`,
            to: forwardingEmail,
            subject: `Submission from ${capitalizedName}`,
            html: `
                <p>Hello,</p>
                <p>New Submission from <strong>${capitalizedName}</strong>.</p>
                <p>Email address is <strong>${email}</strong>.</p>
                <p>Added newsletters are <strong>${subscribedNewsletter}</strong>.</p>
                 <a href="${baseUrl}/confirm?email=${encodeURIComponent(email)}&name=${encodeURIComponent(capitalizedName)}&newsletters=${encodeURIComponent(JSON.stringify(subscribedNewsletter))}"
       style="background-color:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
       Confirm Action
    </a>
        `,
        });

        return Response.json({ success: true, result });
    } catch (error: unknown) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}