
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

const pendingDocuments = [
  { id: 'DOC003', userName: 'SolarSellers Inc.', projectName: 'Rooftop Revolution', fileName: 'Rooftop_Revolution_Prospectus.pdf', type: 'Project Prospectus', uploadedAt: '2024-07-15' },
  { id: 'DOC005', userName: 'GreenEnergy Co.', projectName: 'Sunshine Valley', fileName: 'Sunshine_Valley_Certification.pdf', type: 'Energy Certification', uploadedAt: '2024-07-20' },
  { id: 'DOC006', userName: 'EcoPower', projectName: 'Sahara Solar', fileName: 'Sahara_Solar_Legal.docx', type: 'Legal Agreement', uploadedAt: '2024-07-21' },
];

export default function DocumentReviewList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Documents</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>File Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Uploaded At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium">{doc.userName}</TableCell>
                                <TableCell>{doc.projectName}</TableCell>
                                <TableCell><a href="#" className="underline hover:text-primary">{doc.fileName}</a></TableCell>
                                <TableCell>{doc.type}</TableCell>
                                <TableCell>{doc.uploadedAt}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
                                            <CheckCircle className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                            <XCircle className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
