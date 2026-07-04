import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
};

export function ModuleEmptyState({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Contenido del módulo en construcción
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
