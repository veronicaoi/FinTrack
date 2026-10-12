import React, { useCallback, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchCategories, createCategory, deleteCategory } from "@/services/api";
import Card from "@/components/Card";
import { colors, spacing, radius } from "@/theme";

interface Category {
    _id: string;
    name: string;
}

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const load = useCallback(() => {
        setIsLoading(true);
        fetchCategories()
            .then((data) => {
                setCategories(data);
                setErrorMessage(null);
            })
            .catch(() => setErrorMessage("Could not load categories."))
            .finally(() => setIsLoading(false));
    }, []);

    useFocusEffect(load);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        try {
            await createCategory(newName.trim());
            setNewName("");
            load();
        } catch {
            setErrorMessage("Could not add category.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
            load();
        } catch {
            setErrorMessage("Could not delete category.");
        }
    };

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Budget Categories</Text>

            <Card>
                <View style={styles.addRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="New category name"
                        value={newName}
                        onChangeText={setNewName}
                    />
                    <Button title="Add" onPress={handleAdd} />
                </View>
            </Card>

            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            {isLoading && <ActivityIndicator style={styles.spacer} />}

            <Card style={styles.listCard}>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text style={styles.rowText}>{item.name}</Text>
                            <Button title="Delete" color={colors.danger} onPress={() => handleDelete(item._id)} />
                        </View>
                    )}
                    ListEmptyComponent={!isLoading ? <Text style={styles.empty}>No categories yet.</Text> : null}
                />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: spacing.md, color: colors.textPrimary },
    addRow: { flexDirection: "row", gap: 8 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: 10,
    },
    listCard: { flex: 1 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    rowText: { fontSize: 16, color: colors.textPrimary },
    error: { color: colors.danger, marginVertical: spacing.sm },
    empty: { color: colors.textSecondary, marginTop: spacing.sm },
    spacer: { marginTop: spacing.sm },
});