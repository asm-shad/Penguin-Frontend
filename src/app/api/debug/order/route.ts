/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');
  
  console.log('Debug endpoint called with orderId:', orderId);
  console.log('Base API URL:', process.env.NEXT_PUBLIC_BASE_API_URL);
  
  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    const endpoint = `${baseUrl}/orders/${orderId}`;
    
    console.log('Calling backend endpoint:', endpoint);
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Backend response text:', responseText);
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
      console.log('Backend parsed data:', parsedData);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid JSON response from backend',
          rawResponse: responseText,
          status: response.status 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      backendStatus: response.status,
      backendData: parsedData,
      orderId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        stack: error.stack,
        orderId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}