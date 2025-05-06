import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SparxGuide = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-6">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Sparx Homework Helper</h1>
        <p className="text-gray-600 mt-2">Learn how to use the Sparx homework reader</p>
      </div>

      <Card className="w-full">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-xl">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">What is Sparx?</h2>
              <p className="text-gray-600">
                Sparx is an online mathematics platform used by schools for homework and learning. 
                This guide will help you understand how to use our Sparx homework reader effectively.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">How it Works</h2>
              <div className="space-y-2">
                <p className="text-gray-600">The Sparx reader can help you:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>View all your homework questions in one place</li>
                  <li>Keep track of your bookwork checks</li>
                  <li>Save your working out and answers</li>
                  <li>Review previous homework assignments</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Safety First</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Important: Always do your homework properly and show your working out in your book. 
                      This tool is meant to help you organize and review your work, not to skip the learning process.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Getting Your Homework</h2>
              <div className="space-y-2">
                <p className="text-gray-600">To use the Sparx reader, you'll need to:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                  <li>Log into your Sparx account</li>
                  <li>Go to your current homework assignment</li>
                  <li>Copy the homework URL from your browser</li>
                  <li>Paste the URL into our reader</li>
                </ol>
              </div>
            </section>

            <section className="mt-8">
              <div className="flex justify-center">
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Start Using Sparx Reader
                </button>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-xl">Features & Tips</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Question Display</h3>
              <p className="text-gray-600">
                Questions are shown clearly with any relevant images and formulas. Each question includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Question number</li>
                <li>Full question text</li>
                <li>Any associated diagrams</li>
                <li>Space for your working</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Bookwork Checks</h3>
              <p className="text-gray-600">
                Keep track of potential bookwork check questions and prepare accordingly:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Highlighted bookwork check questions</li>
                <li>Tips for showing your working</li>
                <li>Common check points</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your homework progress easily:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Questions completed</li>
                <li>Time remaining</li>
                <li>XP earned</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Best Practices</h3>
              <p className="text-gray-600">
                Get the most out of your homework:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Always show your working</li>
                <li>Keep your book organized</li>
                <li>Review mistakes carefully</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SparxGuide; 