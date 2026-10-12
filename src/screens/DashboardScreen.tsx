import React, { useCallback, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    Button,
    ActivityIndicator,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VictoryPie, VictoryChart, VictoryLine, VictoryScatter, VictoryAxis } from "victory-native";

import type { RootStackParamList } from "@/navigation/AppNavigator";
import { fetchTransactions } from "@/services/api";
import { logout } from "@/services/authService";
import { totalsByCategory, totalsByDay, TransactionLike } from "@/utils/aggregate";
import Card from "@/components/Card";
import { colors, spacing } from "@/theme";

const COLORS = ["#115e59", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948", "#b07aa1"];

export default function DashboardScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { width } = useWindowDimensions();
    const chartWidth = width - 48;

    const [transactions, setTransactions] = useState<TransactionLike[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            setIsLoading(true);
            fetchTransactions()
                .then((data) => {
                    if (active) {
                        setTransactions(data);
                        setErrorMessage(null);
                    }
                })
                .catch(() => {
                    if (active) setErrorMessage("Could not load transactions.");
                })
                .finally(() => {
                    if (active) setIsLoading(false);
                });
            return () => {
                active = false;
            };
        }, [])
    );

    const categoryData = totalsByCategory(transactions);
    const dailyData = totalsByDay(transactions);
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
            <View style={styles.buttonRow}>
                <Button title="Add Transaction" onPress={() => navigation.navigate("AddTransaction")} />
                <Button title="Log Out" color={colors.danger} onPress={() => logout()} />
            </View>

            {isLoading && <ActivityIndicator style={styles.spacer} />}
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            {!isLoading && !errorMessage && transactions.length === 0 && (
                <Text style={styles.empty}>No transactions yet. Add one to see your charts.</Text>
            )}

            {transactions.length > 0 && (
                <>
                    <Card style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total Spent</Text>
                        <Text style={styles.totalAmount}>${totalSpent.toFixed(2)}</Text>
                    </Card>

                    <Card>
                        <Text style={styles.sectionTitle}>Spending by Category</Text>
                        <VictoryPie
                            data={categoryData.map((c) => ({ x: c.category, y: c.total }))}
                            colorScale={COLORS}
                            width={chartWidth}
                            height={220}
                            innerRadius={50}
                            labels={() => ""}
                        />
                        {categoryData.map((c, i) => (
                            <View key={c.category} style={styles.legendRow}>
                                <View style={[styles.swatch, { backgroundColor: COLORS[i % COLORS.length] }]} />
                                <Text style={styles.legendText}>
                                    {c.category}: ${c.total.toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </Card>

                    <Card>
                        <Text style={styles.sectionTitle}>Spending Over Time</Text>
                        <VictoryChart width={chartWidth} height={220} domainPadding={{ x: 20 }}>
                            <VictoryAxis
                                tickValues={dailyData.map((_, i) => i + 1)}
                                tickFormat={dailyData.map((d) => d.label)}
                            />
                            <VictoryAxis dependentAxis tickFormat={(v: number) => `$${v}`} />
                            <VictoryLine
                                data={dailyData.map((d, i) => ({ x: i + 1, y: d.total }))}
                                style={{ data: { stroke: colors.primary } }}
                            />
                            <VictoryScatter
                                data={dailyData.map((d, i) => ({ x: i + 1, y: d.total }))}
                                style={{ data: { fill: colors.primary } }}
                            />
                        </VictoryChart>
                    </Card>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { backgroundColor: colors.background },
    container: { padding: spacing.lg, paddingBottom: 48 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.lg },
    totalCard: { backgroundColor: colors.primary },
    totalLabel: { color: "#e5f5f1", fontSize: 14 },
    totalAmount: { color: "#ffffff", fontSize: 32, fontWeight: "bold", marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: spacing.sm, color: colors.textPrimary },
    legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    swatch: { width: 12, height: 12, borderRadius: 2, marginRight: 8 },
    legendText: { color: colors.textPrimary },
    spacer: { marginTop: spacing.lg },
    empty: { color: colors.textSecondary, marginTop: spacing.lg },
    error: { color: colors.danger, marginTop: spacing.md },
});