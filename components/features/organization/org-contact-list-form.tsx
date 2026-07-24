'use client';

import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Trash2, Plus, Phone, Mail, Globe, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface OrgContactListFormProps {
    control: Control<any>;
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    name?: string; // name of the field array, default 'contacts'
}

export function OrgContactListForm({ control, register, errors, name = 'contacts' }: OrgContactListFormProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'email': return <Mail className="h-4 w-4" />;
            case 'phone': return <Phone className="h-4 w-4" />;
            case 'website': return <Globe className="h-4 w-4" />;
            case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
            case 'telegram': return <MessageSquare className="h-4 w-4" />;
            default: return <Phone className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Contacts</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ contactType: 'phone', value: '', label: '', isPublic: true, isPrimary: fields.length === 0 })}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un contact
                </Button>
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-muted-foreground italic">Aucun contact ajouté.</p>
            )}

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-start p-3 border rounded-md bg-muted/20 relative group">
                        <div className="grid gap-3 flex-1 sm:grid-cols-12">
                            <div className="sm:col-span-3">
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register(`${name}.${index}.contactType`)}
                                >
                                    <option value="phone">Téléphone</option>
                                    <option value="email">Email</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="telegram">Telegram</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="twitter">Twitter</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="website">Site Web</option>
                                </select>
                            </div>

                            <div className="sm:col-span-5">
                                <Input
                                    placeholder="Valeur (ex: +237...)"
                                    {...register(`${name}.${index}.value`)}
                                />
                                {(errors as any)?.[name]?.[index]?.value && (
                                    <span className="text-xs text-destructive">{(errors as any)[name][index].value.message}</span>
                                )}
                            </div>

                            <div className="sm:col-span-3">
                                <Input
                                    placeholder="Label (opt.)"
                                    {...register(`${name}.${index}.label`)}
                                />
                            </div>

                            {/* Checkbox for Primary/Public could go here if needed, keeping it simple */}
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
