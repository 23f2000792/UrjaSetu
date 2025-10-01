
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const userDocuments = [
  { id: 'DOC001', name: 'Mojave_Prospectus.pdf', type: 'Project Prospectus', status: 'Approved', uploadedAt: '2024-05-10' },
  { id: 'DOC002', name: 'Mojave_Solar_Certification.pdf', type: 'Energy Certification', status: 'Approved', uploadedAt: '2024-05-11' },
  { id: 'DOC003', name: 'Rooftop_Revolution_Prospectus.pdf', type: 'Project Prospectus', status: 'Pending', uploadedAt: '2024-07-15' },
  { id: 'DOC004', name: 'Community_Solar_Agreement.docx', type: 'Legal Agreement', status: 'Rejected', uploadedAt: '2024-07-18' },
];

export default function DocumentList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Uploaded At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium">{doc.name}</TableCell>
                                <TableCell>{doc.type}</TableCell>
                                <TableCell>{doc.uploadedAt}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        doc.status === 'Approved' ? 'secondary' : 
                                        doc.status === 'Pending' ? 'outline' : 'destructive'
                                    } className={doc.status === 'Approved' ? 'bg-primary/20 text-primary' : ''}>
                                        {doc.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Download</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
