import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Heading,
} from '@react-email/components';

export const StripeWelcomeEmail = () => (
    <Html>
        <Head />
        <Preview>You&apos;re now ready to make live transactions with Stripe!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section>
                    <Text style={logo}>MyLetter</Text>
                    <Heading style={h2}>Hey David, here is your 1. edition - Week 01.07.2025</Heading>
                    <Text style={comment}>
                        Remember, by clicking on a label you can create a custom <Tag title="Letter" type="letter" demo={true} /> and dive deeper into <Tag title="topics" type="topic" demo={true} />, <Tag title="highlights" type="highlight" demo={true} /> and <Tag title="summary modes" type="mode" demo={true} />.
                    </Text>

                    <Hr style={hr} />
                    <Text style={h2}>
                        Report
                    </Text>
                    <Text style={paragraph}>
                        Here comes the immediate abstract of today&apos;s letters. Feels like a weather report and gives high-level view of the content.
                    </Text>
                    <Hr style={hr} />
                    <Text style={h2}>
                        Highlights
                    </Text>
                    <Text style={paragraph}>
                        If you haven&apos;t finished your integration, you might find our{' '}
                        <Link style={anchor} href="https://stripe.com/docs">
                            docs
                        </Link>{' '}
                        handy.
                    </Text>

                    <Hr style={hr} />
                    <Text style={h2}>
                        Content Summary
                    </Text>

                    <Tag title="Markets" type="topic" />
                    <ul style={bulletList}>
                        <li style={bulletItem}>
                            <Text style={paragraph}>Daily Digest</Text>
                            <div style={tagContainer}>
                                <Tag title="10% Increase in S&P" type="highlight" />
                                <Tag title="Apple down" type="highlight" />
                            </div>
                        </li>
                        <li style={bulletItem}>
                            <Text style={paragraph}>Markets Daily</Text>
                            <div style={tagContainer}>
                                <Tag title="CEO fired" type="highlight" />
                                <Tag title="Tech rally" type="highlight" />
                            </div>
                        </li>
                        <li style={bulletItem}>
                            <Text style={paragraph}>Market after hours</Text>
                            <div style={tagContainer}>
                                <Tag title="Earnings beat" type="highlight" />
                                <Tag title="Fed decision" type="highlight" />
                                <Tag title="10% Increase in S&P" type="highlight" />
                                <Tag title="Apple down" type="highlight" />
                            </div>
                        </li>
                    </ul>

                    <Hr style={hr} />
                    <Text style={h2}>Suggested Letter</Text>
                    <div style={card}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                        }}>
                            <Text style={h3}>Week 01.07.2025: Stats about S&P 500</Text>
                            <Text style={{
                                ...comment,
                                whiteSpace: 'nowrap',
                                marginLeft: 'auto'
                            }}> 3 min read </Text>
                        </div>

                        <div style={tagContainer}>
                            <Tag title="Data" type="mode" />
                            <Tag title="Markets" type="topic" />
                            <Tag title="Earnings beat" type="highlight" />
                            <Tag title="Fed decision" type="highlight" />
                            <Tag title="10% Increase in S&P" type="highlight" />
                        </div>
                        <Text style={paragraph}> Here we are with the latest market updates and insights. </Text>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'end' }}>
                            <Tag title="Get Letter" type="letter" />
                        </div>
                    </div>

                    <Text style={h2}>More Letters</Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                        <div style={card}>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={h3}>AI at the core of growth</Text>
                                <Text style={comment}> 2 min read </Text>
                            </div>
                            <div style={tagContainer}>
                                <Tag title="Theme" type="mode" />
                                <Tag title="Markets" type="topic" />
                                <Tag title="10% Increase in S&P" type="highlight" />
                            </div>

                            <Text style={paragraph}> Here we are with the latest market updates and insights. </Text>
                        </div>
                        <div style={card}>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Tag title="Bullet" type="mode" />
                                <Text style={comment}> 4 min read </Text>
                            </div>
                            <Text style={h3}>10 Facts about business</Text>
                            <Text style={paragraph}> Here we are with the latest market updates and insights. </Text>
                        </div>
                        <div style={card}>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Tag title="Editorial" type="mode" />
                                <Text style={comment}> 5 min read </Text>
                            </div>
                            <Text style={h3}>From AI to Business Management</Text>
                            <Text style={paragraph}> Here we are with the latest market updates and insights. </Text>
                        </div>
                        <div style={card}>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Tag title="Prediction" type="mode" />
                                <Text style={comment}> 6 min read </Text>
                            </div>
                            <Text style={h3}>The future of AI</Text>
                            <Text style={paragraph}> Here we are with the latest market updates and insights. </Text>
                        </div>
                    </div>

                    <Hr style={hr} />
                    <Text style={footer}>Create your own letter with a few clicks by visiting</Text>
                    <Button style={button} href="https://dashboard.stripe.com/login">
                        MyLetter Dashboard
                    </Button>
                    <Text style={footer}>For help, account setting and more visit </Text>
                    <Button style={button} href="https://dashboard.stripe.com/login">
                        User Dashboard
                    </Button>

                    <Text style={paragraph}>— The MyLetter team </Text>
                    <Hr style={hr} />
                    <Text style={footer}> MyLetter</Text>
                    <Text style={footer}>
                        <Link href="/" className="text-gray-500 underline">
                            Unsubscribe
                        </Link>
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default StripeWelcomeEmail;

interface TagProps {
    title: string;
    type: 'highlight' | 'topic' | 'mode' | 'letter';
    demo?: boolean;
}

const Tag: React.FC<TagProps> = ({ title, type, demo }) => {
    const baseStyles = {
        height: demo ? '16px' : '32px',
        lineHeight: demo ? '16px' : '32px',
        display: 'inline-block' as const,
        padding: demo ? '0 8px' : '0 12px',
        borderRadius: '20px',
        fontSize: demo ? '12px' : '0.875rem',
    };

    const getStyles = () => {
        switch (type) {
            case 'highlight':
                return {
                    ...baseStyles,
                    backgroundColor: '#e3e8ff',
                    color: '#3b82f6',
                };
            case 'topic':
                return {
                    ...baseStyles,
                    backgroundColor: '#c6f6d5',
                    color: '#16a34a',
                };
            case 'mode':
                return {
                    ...baseStyles,
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                };
            case 'letter':
                return {
                    ...baseStyles,
                    backgroundColor: 'black',
                    color: 'white',
                };
            default:
                return baseStyles;
        }
    };

    return (
        <span style={getStyles()}>
            {title}
        </span>
    );
};

const main = {
    backgroundColor: '#f9fafb',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 48px 48px',
    marginBottom: '64px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const h2 = {
    color: 'black',
    fontSize: '16px',
    lineHeight: '16px',
    fontWeight: 'bold',
    textAlign: 'left' as const,
};

const h3 = {
    color: 'black',
    fontSize: '14px',
    lineHeight: '14px',
    fontWeight: 'bold',
    textAlign: 'left' as const,
};

const paragraph = {
    color: '#525f7f',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left' as const,
};

const comment = {
    color: 'black',
    fontSize: '12px',
    lineHeight: '16px',
    fontStyle: 'italic',
};

const anchor = {
    color: '#556cd6',
};

const card = {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
};

const bulletList = {
    margin: '8px 0',
    paddingLeft: '20px',
    listStyleType: 'disc',
    color: '#525f7f',
};

const bulletItem = {
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '4px',
};

const tagContainer = {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    flex: 1,
    minWidth: 0
};

const button = {
    backgroundColor: '#656ee8',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '10px',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};

const logo = {
    color: '#656ee8',
    fontSize: '24px',
    lineHeight: '24px',
    fontWeight: 'bold',
    textAlign: 'left' as const,
};



