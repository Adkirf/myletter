import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';

const MyLetterConfirmationEmail = (props: { userEmail: string, userName: string, subscribedNewsletter: string[] }) => {
    const { userName, subscribedNewsletter } = props;

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>Your first letter is on its way!</Preview>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] px-[32px] py-[40px] mx-auto max-w-[600px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                                Welcome to MyLetter
                            </Heading>
                            <Text className="text-[16px] text-gray-600 m-0">
                                Your smart newsletter summarization
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Text className="text-[16px] text-gray-900 leading-[24px] mb-[16px]">
                                Hi {userName},
                            </Text>

                            <Text className="text-[16px] text-gray-900 leading-[24px] mb-[16px]">
                                Thank you for signing up for MyLetter! We&apos;re excited to help you stay on top of your newsletters without the overwhelm.
                            </Text>

                            <Text className="text-[16px] text-gray-900 leading-[24px] mb-[16px]">
                                You have successfully subscribed to the following newsletters:
                            </Text>

                            <div className="mb-[24px]">
                                {subscribedNewsletter && subscribedNewsletter.length > 0 ? (
                                    <div className="flex flex-wrap gap-[16px]">
                                        {subscribedNewsletter.map((newsletter: string, index: number) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-[12px] py-[6px] bg-blue-100 text-blue-800 text-[14px] font-medium rounded-full border border-blue-200"
                                            >
                                                {newsletter}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <Text className="text-[14px] text-gray-500 italic">
                                        No newsletters selected
                                    </Text>
                                )}
                            </div>

                            <Text className="text-[16px] text-gray-900 leading-[24px] mb-[24px]">
                                <strong>Here&apos;s what happens next:</strong>
                            </Text>

                            <Section className="bg-gray-50 rounded-[8px] p-[24px] mb-[24px]">
                                <Text className="text-[14px] text-gray-700 leading-[20px] mb-[12px] m-0">
                                    📧 <strong>Every Monday morning</strong>, you&apos;ll receive a personalized summary of your most important newsletter content
                                </Text>
                                <Text className="text-[14px] text-gray-700 leading-[20px] mb-[12px] m-0">
                                    ⚡ <strong>Save hours</strong> by getting key insights without reading every newsletter
                                </Text>
                                <Text className="text-[14px] text-gray-700 leading-[20px] m-0">
                                    🎯 <strong>Stay informed</strong> on what matters most to you and your work
                                </Text>
                            </Section>

                            <Text className="text-[16px] text-gray-900 leading-[24px] mb-[16px]">
                                Your first summary will arrive this Monday at 8:00 AM. We&apos;ll analyze your subscribed newsletters and deliver the most valuable insights straight to your inbox.
                            </Text>

                            <Text className="text-[16px] text-gray-900 leading-[24px] mb-[24px]">
                                Questions? Simply reply to this email - we&apos;re here to help!
                            </Text>

                            <Text className="text-[16px] text-gray-900 leading-[24px] mb-[8px]">
                                Best regards,
                            </Text>
                            <Text className="text-[16px] text-gray-900 leading-[24px] m-0">
                                The MyLetter Team
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="border-t border-gray-200 pt-[24px] text-center">
                            <Text className="text-[12px] text-gray-500 leading-[16px] mb-[8px] m-0">
                                MyLetter - Smart Newsletter Summaries
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[16px] mb-[8px] m-0">
                                123 Innovation Street, Tech District, San Francisco, CA 94105
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                                <Link href="#" className="text-gray-500 underline">
                                    Unsubscribe
                                </Link>
                                {' | '}
                                <Link href="#" className="text-gray-500 underline">
                                    Manage Preferences
                                </Link>
                                {' | '}
                                © 2025 MyLetter. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default MyLetterConfirmationEmail;