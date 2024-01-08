import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  try {
    return NextResponse.json(
      { rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] },
      {
        status: 200
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: "There was an error fetching the range values"
      },
      { status: 500 }
    );
  }
}
